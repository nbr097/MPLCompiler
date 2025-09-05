import OpenAI from 'openai';

/** ---------- STRICT schema: use the RIGHTMOST THREE, in THIS order ----------
 *  Left→Right at the far right of each row:
 *     1) SOH   2) MPL   3) Capacity (sometimes spelled "Capcity")
 */
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

          // RIGHTMOST THREE numeric columns (DO NOT GUESS NAMES; use POSITION ONLY):
          rightmost_soh: { type: 'number' },       // position #1 (leftmost of the trio)
          rightmost_mpl: { type: 'number' },       // position #2 (middle)
          rightmost_capacity: { type: 'number' },  // position #3 (rightmost of the trio)

          // context/debug (always present to satisfy validator)
          raw_row: { type: 'string' }
        },
        required: [
          'article',
          'description',
          'rightmost_soh',
          'rightmost_mpl',
          'rightmost_capacity',
          'raw_row'
        ],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

/** ---------- Prompts (position-locked; SOH, MPL, Capacity) ---------- */
const systemPrompt = `
You are a precise retail inventory parser. Do NOT guess. Extract by POSITION only.

CRITICAL SHAPE (per row):
- The far-right end of each row contains exactly three numeric columns, left→right:
  [ SOH , MPL , Capacity ]   (Capacity may appear misspelled as "Capcity".)
- Ignore any other numeric columns such as OM earlier in the row.

FOR EACH ROW:
1) Read the LAST THREE numeric cells on the right edge.
2) Assign them IN ORDER to: rightmost_soh, rightmost_mpl, rightmost_capacity.
   Never reorder or relabel these three; take them strictly by position.
3) Also return:
   - article (ID) from its column,
   - description (clean human name; remove any supplier prefix like "PI " at the very start),
   - raw_row (verbatim row text you read).
4) Integers only for numbers. If a cell is blank, return 0.

FILTER:
- Only include rows in your output where rightmost_soh ≤ rightmost_mpl.

IMPORTANT:
- Do NOT use totals/footers.
- If OCR is noisy, rely on the position rule above; never substitute Capacity for MPL or vice versa.
`;

const userPrompt = `
Goal: Return ONLY items where SOH ≤ MPL using the RIGHTMOST-THREE rule above.
Output MUST match the JSON schema exactly. Numbers are integers; blanks become 0.
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

    // 2) Responses API with Structured Outputs (position-locked to SOH,MPL,Capacity)
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
          name: 'RightmostTripleSOH_MPL_Capacity',
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

    const finalRows = Array.isArray(data.rows) ? data.rows
      .map(r => {
        const soh = toInt(r.rightmost_soh);
        const mpl = toInt(r.rightmost_mpl);
        return {
          article: String(r.article ?? '').trim(),
          description: cleanDescription(r.description),
          mpl,
          soh
        };
      })
      // Defensive re-filter in case any bad row slipped through
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
