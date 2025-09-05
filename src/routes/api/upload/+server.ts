import OpenAI from 'openai';

/** ---------- STRICT schema: use rightmost triple only ---------- */
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

          // RIGHTMOST THREE numeric columns in order (no guessing):
          rightmost_mpl: { type: 'number' },      // value from the rightmost trio position #1
          rightmost_capcity: { type: 'number' },  // value from the rightmost trio position #2 (spelled "Capcity" in the report)
          rightmost_soh: { type: 'number' },      // value from the rightmost trio position #3

          // extra context (always present to satisfy validator)
          om: { type: 'number' },                 // OM near start (NOT used for filter)
          raw_row: { type: 'string' }             // raw textual row you parsed
        },
        required: [
          'article',
          'description',
          'rightmost_mpl',
          'rightmost_capcity',
          'rightmost_soh',
          'om',
          'raw_row'
        ],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

/** ---------- Prompts (position-locked) ---------- */
const systemPrompt = `
You are a precise retail inventory parser. Do NOT guess. Read table rows and extract by POSITION.

CRITICAL:
- Every row ends with a block of three numeric columns at the right edge.
- Those three (in left→right order) are EXACTLY:
  [ 1st = MPL,  2nd = Capcity (capacity, may be misspelled),  3rd = SOH ].
- Ignore any other numeric columns (e.g. OM). OM appears near the start and is not part of the rightmost trio.

For EACH row:
1) Return the three rightmost numeric values as:
   rightmost_mpl, rightmost_capcity, rightmost_soh — in that exact order. Never swap or reorder.
2) Also return:
   - article (ID) from its column,
   - description (human-friendly name; strip any supplier prefixes like "PI " at the very start),
   - om (the OM value near the start; if blank, return 0),
   - raw_row (the raw text of the line you read).
3) Integers only for all numbers. If a cell is blank, return 0.

IMPORTANT:
- Do not rename or map these three; just take them by position.
- Do not use sums/totals/footers.
- Only include rows in your output where rightmost_soh ≤ rightmost_mpl.
`;

const userPrompt = `
Goal: Return ONLY items where SOH ≤ MPL using the RIGHTMOST-THREE rule above.
Output must match the JSON schema exactly. Numbers are integers; blanks become 0.
`;

/** ---------- Helpers ---------- */
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

    // 1) Upload file, get file_id
    const uploaded = await openai.files.create({
      file,
      purpose: 'assistants'
    });

    // 2) Responses API with Structured Outputs (position-locked)
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
          name: 'RightmostTripleRows',
          schema: jsonSchema,
          strict: true
        }
      }
    });

    // 3) Extract JSON text
    let outStr = resp?.output_text;
    if (!outStr) {
      try {
        const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
        if (first?.text) outStr = first.text;
      } catch { /* noop */ }
    }
    if (!outStr) outStr = JSON.stringify({ rows: [] });

    // 4) Harden + map to final rows
    let data = {};
    try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

    const finalRows = Array.isArray(data.rows) ? data.rows.map(r => {
      const mpl = toInt(r.rightmost_mpl);
      const soh = toInt(r.rightmost_soh);

      return {
        article: String(r.article ?? '').trim(),
        description: cleanDescription(r.description),
        mpl,
        soh
      };
    })
    // Defensive re-filter in case the model slipped a violating row in:
    .filter(r => r.article && r.soh <= r.mpl)
    : [];

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
