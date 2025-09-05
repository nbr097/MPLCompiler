import OpenAI from 'openai';

/** ---------- Strict JSON Schema (all keys required) ---------- */
/* OpenAI Structured Outputs wants all properties listed in `required`. */
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
          capacity: { type: 'number' },     // from "Capcity" column (misspelled in report)
          om: { type: 'number' },           // from "OM" column
          mpl_header: { type: 'string' },   // exact header used for mpl
          soh_header: { type: 'string' },   // exact header used for soh
          raw_row: { type: 'string' }       // raw text of the parsed row
        },
        required: [
          'article',
          'description',
          'mpl',
          'soh',
          'capacity',
          'om',
          'mpl_header',
          'soh_header',
          'raw_row'
        ],
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

Typical header layout includes (order varies):
"Description  OM  Article  ...  MPL  Capcity  SOH"

Rules:
- Map fields ONLY by header names (or obvious synonyms).
- MPL column: header exactly "MPL".
- SOH column: header exactly "SOH".
- Capacity column may appear as "Capcity" (misspelled). Do NOT treat Capacity as MPL or SOH.
- OM appears near the start of rows and is NOT MPL or SOH.
- Article: 5–8+ digit identifier.
- Description: human-friendly name; remove supplier prefixes like "PI ", "WW ", "BW " if they appear at the very start.
- IMPORTANT: On each row, the rightmost trio is typically "MPL  Capcity  SOH". Use header names first; if OCR is ambiguous, fall back to this right-edge ordering.
- Never swap MPL with SOH. If uncertain, reflect what you used in mpl_header/soh_header and include raw_row for traceability.
- Integers only for mpl, soh, capacity, om (no strings).
- Only include rows where SOH ≤ MPL.
- Output all required fields. If a numeric cell is blank, return 0. If a string cell is blank, return "".
`;

const userPrompt = `
Task: From this document, return ONLY the items where SOH ≤ MPL.
Return JSON that matches the provided schema exactly (all fields required).
Include:
- capacity (from "Capcity"),
- om (from "OM"),
- mpl_header and soh_header (the exact header names you used),
- raw_row (the raw text of the line you read).
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
  // Heuristics to catch MPL/SOH swaps or MPL==Capacity mistakes
  if (capacity != null && mpl === capacity && soh > mpl) return true;
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

    // 3) Extract text JSON
    let outStr = resp?.output_text;
    if (!outStr) {
      try {
        const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
        if (first?.text) outStr = first.text;
      } catch { /* noop */ }
    }
    if (!outStr) outStr = JSON.stringify({ rows: [] });

    // 4) Harden + validate
    let data = {};
    try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

    const cleaned = Array.isArray(data.rows) ? data.rows.map(r => {
      const mpl = toInt(r.mpl);
      const soh = toInt(r.soh);
      const capacity = toInt(r.capacity);
      const om = toInt(r.om);

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

    // Must come from correct headers, not look swapped, and satisfy inequality
    const finalRows = cleaned
      .filter(r => {
        const headerOK =
          (!r.mpl_header || r.mpl_header === 'MPL') &&
          (!r.soh_header || r.soh_header === 'SOH');

        if (!r.article) return false;
        if (!headerOK) return false;
        if (looksSwapped(r.mpl, r.soh, r.capacity, r.om)) return false;
        return r.soh <= r.mpl;
      })
      .map(({ article, description, mpl, soh }) => ({ article, description, mpl, soh }));

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
