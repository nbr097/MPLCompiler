import OpenAI from 'openai';

/**
 * We ask the model for:
 *  - header-anchored MPL/SOH (strictly from "MPL" and "SOH" headers)
 *  - the rightmost trio (SOH, MPL, Capacity) as a second source of truth
 *  - exact headers used and a raw_row string for traceability
 *
 * On the server we then:
 *  - prefer header-anchored numbers when headers are correct
 *  - fall back to the rightmost trio when headers look wrong or swapped
 *  - never return Capacity; UI only gets article, description, mpl, soh
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

          // Header-mapped values (primary)
          mpl: { type: 'number' },               // from column header "MPL"
          soh: { type: 'number' },               // from column header "SOH"
          mpl_header: { type: 'string' },        // exact header string used for mpl
          soh_header: { type: 'string' },        // exact header string used for soh

          // Rightmost trio (secondary, for validation only)
          tail_soh: { type: 'number' },          // left of the last-three at far right
          tail_mpl: { type: 'number' },          // middle of the last-three at far right
          tail_capacity: { type: 'number' },     // rightmost of the last-three (a.k.a. "Capcity")

          // Traceability
          raw_row: { type: 'string' }
        },
        required: [
          'article',
          'description',
          'mpl',
          'soh',
          'mpl_header',
          'soh_header',
          'tail_soh',
          'tail_mpl',
          'tail_capacity',
          'raw_row'
        ],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

const systemPrompt = `
You are a precise inventory table parser. Do NOT guess; follow these rules exactly.

Headers & mapping (PRIMARY SOURCE):
- Read MPL strictly from the column with header text exactly "MPL".
- Read SOH strictly from the column with header text exactly "SOH".
- Never use "Capacity" (sometimes spelled "Capcity") for MPL or SOH.
- OM is unrelated; never use OM for MPL or SOH.

Right-edge trio (SECONDARY SOURCE for validation only):
- At the far right of each row there are three numeric cells in left→right order:
  [ SOH , MPL , Capacity ]   (Capacity may appear as "Capcity").
- Extract those three numbers into tail_soh, tail_mpl, tail_capacity.

Output requirements for each row object:
- article: item ID from the "Article" column (digits/string)
- description: clean item name without supplier prefixes (e.g., remove leading "PI " / "WW " / "BW ")
- mpl, soh: integers from the PRIMARY header-mapped columns only
- mpl_header, soh_header: the exact header strings used for those values
- tail_soh, tail_mpl, tail_capacity: integers from the rightmost trio (secondary)
- raw_row: the verbatim text of the row you read, including the final numbers

General:
- Integers only for all numbers; if a cell is blank, output 0.
- Do NOT output totals/footers or header rows.
- You may include rows where SOH > MPL; filtering is done server-side.
`;

const userPrompt = `
Task: Extract rows from the document per the rules.
Return JSON that matches the provided schema exactly.
`;

/* ---------------- Helpers ---------------- */

function cleanDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  // strip short supplier prefixes like "PI ", "WW ", "BW " at the very start
  const cleaned = desc.replace(/^[A-Z]{1,3}\s+(?=[A-Za-z0-9])/u, '');
  return cleaned.trim().replace(/\s{2,}/g, ' ');
}

function toInt(n) {
  if (n === null || n === undefined) return 0;
  const x = parseInt(String(n).replace(/[, ]/g, ''), 10);
  return Number.isFinite(x) ? x : 0;
}

/**
 * Decide final (mpl, soh) using:
 *  1) header-anchored values if headers look correct: MPL->"MPL" & SOH->"SOH"
 *  2) otherwise, fall back to the rightmost trio (soh=tail_soh, mpl=tail_mpl)
 *  3) if header values equal tail_capacity or look swapped, prefer tail_* pair
 */
function chooseFinalPair(row) {
  const mh = (row.mpl_header || '').toString().trim().toUpperCase();
  const sh = (row.soh_header || '').toString().trim().toUpperCase();

  const headerLooksRight = (mh === 'MPL' && sh === 'SOH');

  const h_mpl = toInt(row.mpl);
  const h_soh = toInt(row.soh);
  const t_mpl = toInt(row.tail_mpl);
  const t_soh = toInt(row.tail_soh);
  const t_cap = toInt(row.tail_capacity);

  // obvious swap patterns: header MPL equals capacity or equals tail SOH, etc.
  const headerLooksSwapped =
    (h_mpl === t_cap && t_mpl !== t_cap) || // MPL accidentally taken from capacity
    (h_mpl === t_soh && h_soh === t_mpl);   // pure swap

  // prefer header when headers are correct AND not swapped AND non-zero-ish
  const headerUsable = headerLooksRight && !headerLooksSwapped && !(h_mpl === 0 && t_mpl > 0);

  if (headerUsable) {
    return { mpl: h_mpl, soh: h_soh };
  }

  // fallback to rightmost trio
  return { mpl: t_mpl, soh: t_soh };
}

/* ---------------- Endpoint ---------------- */

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

    // Show the model back to the UI for transparency
    const model = platform?.env?.OPENAI_MODEL || 'gpt-5';
    const baseURL = platform?.env?.OPENAI_BASE_URL;

    const openai = new OpenAI({ apiKey, baseURL });

    // 1) Upload file → file_id
    const uploaded = await openai.files.create({
      file,
      purpose: 'assistants'
    });

    // 2) Responses API + Structured Outputs (temperature 0 to avoid "creative" swaps)
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
      },
      temperature: 0,
      max_output_tokens: 4000
    });

    // 3) Extract JSON text from Responses API
    let outStr = resp?.output_text;
    if (!outStr) {
      try {
        const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
        if (first?.text) outStr = first.text;
      } catch { /* noop */ }
    }
    if (!outStr) outStr = JSON.stringify({ rows: [] });

    // 4) Harden, choose final values, and filter SOH ≤ MPL
    let data = {};
    try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

    const finalRows = (Array.isArray(data.rows) ? data.rows : [])
      .map((r) => {
        const { mpl, soh } = chooseFinalPair(r);
        return {
          article: String(r.article ?? '').trim(),
          description: cleanDescription(r.description),
          mpl,
          soh
        };
      })
      .filter(r => r.article && r.soh <= r.mpl);

    // Echo the model so the UI can display it
    return new Response(JSON.stringify({ model, rows: finalRows }), {
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
