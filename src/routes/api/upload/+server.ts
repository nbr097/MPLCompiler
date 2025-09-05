import OpenAI from 'openai';

/** STRICT schema: only what we need the model to provide reliably */
const jsonSchema = {
  type: 'object',
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          article: { type: 'string' },     // item ID from its column
          description: { type: 'string' }, // human-friendly name (no supplier prefix)
          raw_row: { type: 'string' }      // the full text of the row INCLUDING the final numeric trio
        },
        required: ['article', 'description', 'raw_row'],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

/** Prompts: row text capture, NOT numeric mapping */
const systemPrompt = `
You are a precise PDF table transcriber. Do NOT guess or infer values.

For each table ROW:
- Return:
  • article = item ID from its "Article" column (digits)
  • description = item name (remove supplier prefixes like "PI " at the very start)
  • raw_row = the VERBATIM single-line text for that row as it appears, INCLUDING the final three numeric cells at the far right

IMPORTANT layout rule:
- At the far right of each row, the last three numeric cells appear left→right as: SOH, MPL, Capacity (Capacity may be spelled "Capcity").
- Do NOT label or reorder those numbers yourself. Simply ensure raw_row ends with these three numbers in the exact order they appear.
- If a numeric cell is blank, it may be rendered as 0 — keep the sequence and spacing as-is.

Never output totals/footers.
Return integers and plain text only; no extra keys beyond the schema.
`;

const userPrompt = `
Task: Transcribe table rows from the document.
Return only article, description, and raw_row (verbatim).
Do NOT try to compute MPL or SOH — we will derive them from raw_row.
`;

/** Helpers */
function cleanDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  // remove short supplier prefixes like "PI ", "WW ", "BW " at the very start
  const cleaned = desc.replace(/^[A-Z]{1,3}\s+(?=[A-Za-z0-9])/u, '');
  return cleaned.trim().replace(/\s{2,}/g, ' ');
}

function toInt(n) {
  if (n === null || n === undefined) return 0;
  const x = parseInt(String(n).replace(/[, ]/g, ''), 10);
  return Number.isFinite(x) ? x : 0;
}

/** Extract the last three integers from a row of text (left→right order) */
function extractTailTriple(raw) {
  if (!raw) return null;
  // Match integers (allow thousands separators before joining)
  const matches = [...raw.matchAll(/(\d{1,3}(?:,\d{3})*|\d+)(?![^\s])/g)].map(m => m[1]);
  // Fallback if the above anchors to end-of-token too strictly:
  const allNums = matches.length ? matches : [...raw.matchAll(/\d{1,3}(?:,\d{3})*|\d+/g)].map(m => m[0]);

  if (allNums.length < 3) return null;
  const a = allNums.slice(-3).map(s => toInt(s));
  // a[0]=SOH, a[1]=MPL, a[2]=Capacity per your layout
  return { soh: a[0], mpl: a[1], capacity: a[2] };
}

export const POST = async ({ request, platform }) => {
  try {
    const form = await request.formData();
    const provider = (form.get('provider') || 'openai').toString();
    const file = form.get('file');

    if (!file) return new Response('No file', { status: 400 });
    if (provider !== 'openai') {
      return new Response(
        JSON.stringify({ error: 'Gemini path not enabled in this starter. Use OpenAI for now.' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const apiKey = platform?.env?.OPENAI_API_KEY;
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500 });

    const model = platform?.env?.OPENAI_MODEL || 'gpt-4o-mini';
    const baseURL = platform?.env?.OPENAI_BASE_URL;

    const openai = new OpenAI({ apiKey, baseURL });

    // 1) Upload file → file_id
    const uploaded = await openai.files.create({
      file,
      purpose: 'assistants'
    });

    // 2) Ask ONLY for article/description/raw_row (structured output)
    const resp = await openai.responses.create({
      model,
      input: [
        { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
        {
          role: 'user',
          content: [
            { type: 'input_text', text: userPrompt },
            { type: 'input_file', file_id: uploaded.id }
          ]
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'RowTranscription',
          schema: jsonSchema,
          strict: true
        }
      }
    });

    // 3) Pull the JSON string
    let outStr = resp?.output_text;
    if (!outStr) {
      try {
        const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
        if (first?.text) outStr = first.text;
      } catch { /* noop */ }
    }
    if (!outStr) outStr = JSON.stringify({ rows: [] });

    // 4) Deterministic parsing of SOH/MPL from raw_row tail
    let data = {};
    try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

    const rows = Array.isArray(data.rows) ? data.rows : [];

    const finalRows = rows.map(r => {
      const article = String(r.article ?? '').trim();
      const description = cleanDescription(r.description);
      const triple = extractTailTriple(String(r.raw_row ?? ''));

      if (!triple) return null;
      const { soh, mpl } = triple;

      return { article, description, mpl, soh };
    })
    .filter(Boolean)
    // apply your filter
    .filter(r => r.article && r.soh <= r.mpl);

    return new Response(JSON.stringify({ rows: finalRows }), {
      headers: { 'content-type': 'application/json' }
    });

  } catch (e) {
    try {
      const detail = e?.response ? await e.response.text() : e?.message || String(e);
      return new Response(detail, { status: e?.status || 500, headers: { 'content-type': 'application/json' } });
    } catch {
      return new Response(e?.message ?? 'Server error', { status: 500 });
    }
  }
};
