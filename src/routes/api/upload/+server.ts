import OpenAI from 'openai';

/** ---------- Strict JSON Schema (with a few optional debug fields) ---------- */
const jsonSchema = {
  type: 'object',
  properties: {
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          article: { type: 'string' },
          description: { type: 'string' },
          mpl: { type: 'number' },
          soh: { type: 'number' },

          // Optional diagnostics we won't show in the UI but help the model be precise
          capacity: { type: 'number' },
          om: { type: 'number' },
          mpl_header: { type: 'string' },
          soh_header: { type: 'string' },
          raw_row: { type: 'string' }
        },
        required: ['article', 'description', 'mpl', 'soh'],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

/** ---------- Prompts (header-anchored rules) ---------- */
const systemPrompt = `
You are a precise retail inventory parser. Extract data STRICTLY by table column headers.

The report header includes many columns such as:
"Description  OM  Article  ...  MPL  Capcity  SOH"
Rules:
- Map fields ONLY by header names (or clear synonyms).
- MPL column: header exactly "MPL".
- SOH column: header exactly "SOH".
- Capacity column may appear as "Capcity" (misspelled). Do NOT treat Capacity as MPL or SOH.
- OM is near the start of the row and is NOT MPL.
- Article: 5-8+ digit identifier.
- Description: human-friendly item name; remove supplier prefixes like "PI ", "WW ", "BW " if present at the start.
- Use integers for MPL and SOH.
- IMPORTANT: In each row, the *last three* numeric columns are in the order: MPL, Capcity, SOH. If ambiguous, rely on header names and this right-edge ordering.
- Never swap MPL with SOH. If uncertain, do not guess; leave a note in raw_row and choose the values as per header positions.
- Only include rows where SOH ≤ MPL.
`;

const userPrompt = `
Task: From this document, return ONLY the items where SOH ≤ MPL.
Return JSON matching the provided schema. Also include optional fields:
- capacity (number extracted from "Capcity"),
- om (number from "OM"),
- mpl_header and soh_header (exact header text you used),
- raw_row (the raw text of the row you read).
`;

/** ---------- Helpers ---------- */
function cleanDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  // strip supplier prefixes like "PI ", "WW ", "BW " at the very start
  const cleaned = desc.replace(/^[A-Z]{1,3}\s+(?=[A-Za-z0-9])/u, '');
  return cleaned.trim().replace(/\s{2,}/g, ' ');
}
function toInt(n) {
  if (n === null || n === undefined) return 0;
  const x = parseInt(String(n).replace(/[, ]/g, ''), 10);
  return Number.isFinite(x) ? x : 0;
}
function looksSwapped(mpl, soh, capacity, om) {
  // Common failure: MPL mistakenly taken from OM or Capacity.
  // If SOH > MPL by a wide margin AND capacity === mpl, it's likely swapped.
  if (capacity != null && mpl === capacity && soh > mpl) return true;
  // If mpl equals om (and om is in the small floaty range like 3, 9, 22.5) and soh is the largest tail value:
  if (om != null && mpl === om && soh > mpl) return true;
  return false;
}

/** ---------- Endpoint ---------- */
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

    // 1) Upload and get file_id
    const uploaded = await openai.files.create({
      file,
      purpose: 'assistants'
    });

    // 2) Ask for structured output anchored to headers
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
          name: 'InventoryRows',
          schema: jsonSchema,
          strict: true
        }
      }
    });

    // 3) Extract JSON
    let outStr = resp?.output_text;
    if (!outStr) {
      try {
        const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
        if (first?.text) outStr = first.text;
      } catch { /* noop */ }
    }
    if (!outStr) outStr = JSON.stringify({ rows: [] });

    /** 4) Harden and validate rows server-side */
    let data = {};
    try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

    const cleaned = Array.isArray(data.rows) ? data.rows.map(r => {
      const mpl = toInt(r.mpl);
      const soh = toInt(r.soh);
      const capacity = r.capacity != null ? toInt(r.capacity) : null;
      const om = r.om != null ? toInt(r.om) : null;

      return {
        article: String(r.article ?? '').trim(),
        description: cleanDescription(r.description),
        mpl,
        soh,
        capacity,
        om,
        mpl_header: (r.mpl_header || '').toString().trim().toUpperCase(),
        soh_header: (r.soh_header || '').toString().trim().toUpperCase(),
        raw_row: (r.raw_row || '').toString()
      };
    }) : [];

    // Validation: must map from explicit headers, must not look swapped, must satisfy the inequality
    const finalRows = cleaned.filter(r => {
      const headerOK =
        (!r.mpl_header || r.mpl_header === 'MPL') &&
        (!r.soh_header || r.soh_header === 'SOH');

      if (!r.article || r.mpl < 0 || r.soh < 0) return false;
      if (!headerOK) return false;
      if (looksSwapped(r.mpl, r.soh, r.capacity, r.om)) return false;
      return r.soh <= r.mpl;
    }).map(({ article, description, mpl, soh }) => ({ article, description, mpl, soh }));

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
