import OpenAI from 'openai';

// ----- Strict JSON Schema for model output -----
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
          soh: { type: 'number' }
        },
        required: ['article', 'description', 'mpl', 'soh'],
        additionalProperties: false
      }
    }
  },
  required: ['rows'],
  additionalProperties: false
};

// ----- System + user guidance: header-anchored parsing -----
const systemPrompt = `
You are a precise retail inventory parser. You must extract data strictly by table column headers and never guess.
Important constraints:
- Identify the table headers first. Map fields ONLY by these headers (or explicit synonyms below).
- MPL column: header EXACTLY "MPL" or synonyms {"MIN PRESENTATION LEVEL","MIN PRESENTATION","MIN FACING","MIN FACES"}.
- SOH column: header EXACTLY "SOH" or synonyms {"STOCK ON HAND"}.
- Article: header {"ARTICLE","ARTICLE #","ARTICLE NO","ART","ITEM","ITEM NO"} (numeric/string id).
- Description: header {"DESCRIPTION","DESC"}.
- IGNORE "CAPACITY"/"CAPCITY" columns completely. They are NOT MPL or SOH.
- Do NOT use totals/subtotals or footer text. Only take values from the same ROW as the Article.
- Return integers for MPL and SOH (no strings).
- Keep description human-friendly and do NOT include supplier prefixes/codes that come before the real name (e.g., remove short all-caps prefixes like "PI", "WW", "BW" at the start of the description if present).
- Only include rows where SOH ≤ MPL.
`;

// Short user prompt that references the file and the goal
const userPrompt = `
Task: From this document, return ONLY the items where SOH ≤ MPL.
Fields per row: article (ID), description (clean), mpl (int), soh (int).
Ignore capacity/capcity. Map strictly by table headers (see rules).
Return JSON exactly matching the provided schema.
`;

// ----- small helpers to harden the result server-side -----
function cleanDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  // strip supplier prefixes like "PI ", "WW ", "BW " at the very start
  const cleaned = desc.replace(/^[A-Z]{1,3}\s+(?=[A-Za-z0-9])/, '');
  // trim & collapse spaces
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

    // 1) Upload PDF and get file_id
    const uploaded = await openai.files.create({
      file,
      purpose: 'assistants'
    });

    // 2) Responses API with Structured Outputs (json schema under text.format)
    const resp = await openai.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: systemPrompt }]
        },
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

    // 3) Parse model output JSON
    let outStr = resp?.output_text;
    if (!outStr) {
      // fallback just in case SDK shape differs
      try {
        const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
        if (first?.text) outStr = first.text;
      } catch { /* noop */ }
    }
    if (!outStr) outStr = JSON.stringify({ rows: [] });

    let data = {};
    try { data = JSON.parse(outStr); } catch { data = { rows: [] }; }

    // 4) Server-side hardening:
    //    - normalize description (strip supplier codes)
    //    - ensure integers
    //    - final filter SOH ≤ MPL (defensive)
    const cleanedRows = Array.isArray(data.rows) ? data.rows.map(r => ({
      article: String(r.article ?? '').trim(),
      description: cleanDescription(r.description),
      mpl: toInt(r.mpl),
      soh: toInt(r.soh)
    })) : [];

    const finalRows = cleanedRows.filter(r => r.article && r.mpl >= 0 && r.soh >= 0 && r.soh <= r.mpl);

    return new Response(JSON.stringify({ rows: finalRows }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    // Surface useful errors (quota, auth, etc.)
    try {
      const detail = e?.response ? await e.response.text() : e?.message || String(e);
      return new Response(detail, { status: e?.status || 500, headers: { 'content-type': 'application/json' } });
    } catch {
      return new Response(e?.message ?? 'Server error', { status: 500 });
    }
  }
};
