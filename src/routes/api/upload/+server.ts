import OpenAI from 'openai';

/** STRICT schema: only the fields we need + header audit (no capacity) */
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
          mpl: { type: 'number' },          // value under header "MPL"
          soh: { type: 'number' },          // value under header "SOH"
          mpl_header: { type: 'string' },   // exact header text used for mpl
          soh_header: { type: 'string' }    // exact header text used for soh
        },
        required: ['article', 'description', 'mpl', 'soh', 'mpl_header', 'soh_header'],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

/** Header-anchored + fallback-to-position (NO capacity scraping) */
const systemPrompt = `
You are a precise retail inventory parser. Do NOT guess. Extract strictly by headers.

Rules:
- Map fields ONLY from columns whose headers are exactly:
  • "SOH" → Stock on Hand
  • "MPL" → Minimum Presentation Level
- Completely IGNORE any column named "Capacity" or misspelled "Capcity".
- OM is unrelated; never use OM for MPL or SOH.
- If headers are noisy or OCR is imperfect, FALL BACK to the right-edge trio order:
    [ SOH , MPL , Capacity ]  (left→right at the far right of each row)
  When using this fallback, still output only SOH and MPL (ignore Capacity).
- Return integers for all numbers (no strings). If a numeric cell is blank, return 0.
- Article: the item ID from its column (digits).
- Description: human-friendly item name; remove supplier prefixes like "PI " at the very start.
- Only include rows where SOH ≤ MPL.
- Also return mpl_header and soh_header as the EXACT header text you used (e.g., "MPL", "SOH").
- Never output any capacity field.
`;

const userPrompt = `
Task: From this document, return ONLY the items where SOH ≤ MPL.
Output JSON must match the schema. Include mpl_header and soh_header for audit.
Do not output capacity at all.
`;

/** Helpers */
function cleanDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const cleaned = desc.replace(/^[A-Z]{1,3}\s+(?=[A-Za-z0-9])/u, ''); // drop "PI ", "WW ", etc. at start
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

    // 1) Upload file → file_id
    const uploaded = await openai.files.create({
      file,
      purpose: 'assistants'
    });

    // 2) Responses API with Structured Outputs (headers-only, no capacity)
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
          name: 'SOH_MPL_Only',
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

    // 4) Harden + fix any swaps using header audit
    let data = {};
    try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

    const cleaned = Array.isArray(data.rows) ? data.rows.map(r => {
      let mpl = toInt(r.mpl);
      let soh = toInt(r.soh);

      const mh = (r.mpl_header || '').toString().trim().toUpperCase();
      const sh = (r.soh_header || '').toString().trim().toUpperCase();

      // If model admits it swapped, swap back
      if (mh === 'SOH' && sh === 'MPL') {
        const tmp = mpl; mpl = soh; soh = tmp;
      }

      // If headers are unrecognized, drop later
      return {
        article: String(r.article ?? '').trim(),
        description: cleanDescription(r.description),
        mpl, soh,
        mpl_header: mh,
        soh_header: sh
      };
    }) : [];

    // Validate: must declare correct headers, and satisfy inequality
    const finalRows = cleaned
      .filter(r =>
        r.article &&
        (r.mpl_header === 'MPL' && r.soh_header === 'SOH') &&
        r.soh <= r.mpl
      )
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
