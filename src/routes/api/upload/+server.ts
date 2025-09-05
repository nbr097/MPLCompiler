import OpenAI from 'openai';

/**
 * Structured output schema.
 * We collect header-anchored values (mpl, soh, + headers), the rightmost trio
 * as a second source of truth, and a raw_row string for diagnostics.
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

          // Header-mapped (primary)
          mpl: { type: 'number' },
          soh: { type: 'number' },
          mpl_header: { type: 'string' },
          soh_header: { type: 'string' },

          // Rightmost trio (secondary)
          tail_soh: { type: 'number' },
          tail_mpl: { type: 'number' },
          tail_capacity: { type: 'number' },

          // Diagnostics
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
- Never use "Capacity"/"Capcity" or "OM" for MPL or SOH.

Right-edge trio (SECONDARY SOURCE for validation only):
- At the far right of each row there are three numeric cells in left→right order:
  [ SOH , MPL , Capacity ] (Capacity may appear as "Capcity").
- Extract those into tail_soh, tail_mpl, tail_capacity.

For each row output:
- article (ID), description (clean; remove leading supplier prefixes like "PI ")
- mpl, soh (ints) from the PRIMARY headers
- mpl_header, soh_header (exact header strings used)
- tail_soh, tail_mpl, tail_capacity (ints) from the rightmost trio
- raw_row (verbatim text of that row)

Integers only; blank numeric cells become 0. No totals/footers/headers.
`;

const userPrompt = `
Task: Extract rows per the rules. Return JSON matching the schema exactly.
`;

/* ---------------- Helpers ---------------- */

function cleanDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const cleaned = desc.replace(/^[A-Z]{1,3}\s+(?=[A-Za-z0-9])/u, ''); // drop "PI ", "WW ", etc.
  return cleaned.trim().replace(/\s{2,}/g, ' ');
}

function toInt(n) {
  if (n === null || n === undefined) return 0;
  const x = parseInt(String(n).replace(/[, ]/g, ''), 10);
  return Number.isFinite(x) ? x : 0;
}

/** Choose final MPL/SOH using header source unless it looks swapped, else rightmost trio */
function chooseFinalPair(row) {
  const mh = (row.mpl_header || '').toString().trim().toUpperCase();
  const sh = (row.soh_header || '').toString().trim().toUpperCase();

  const headerLooksRight = (mh === 'MPL' && sh === 'SOH');

  const h_mpl = toInt(row.mpl);
  const h_soh = toInt(row.soh);
  const t_mpl = toInt(row.tail_mpl);
  const t_soh = toInt(row.tail_soh);
  const t_cap = toInt(row.tail_capacity);

  const headerLooksSwapped =
    (h_mpl === t_cap && t_mpl !== t_cap) || // MPL accidentally taken from capacity
    (h_mpl === t_soh && h_soh === t_mpl);   // classic swap

  const headerUsable = headerLooksRight && !headerLooksSwapped && !(h_mpl === 0 && t_mpl > 0);

  if (headerUsable) return { mpl: h_mpl, soh: h_soh };
  return { mpl: t_mpl, soh: t_soh };
}

/* ---------------- Endpoint ---------------- */

export const POST = async ({ request, platform }) => {
  // never cache API responses
  const noStore = { 'cache-control': 'no-store', 'content-type': 'application/json' };

  try {
    const form = await request.formData();
    const provider = (form.get('provider') || 'openai').toString();
    const file = form.get('file');

    if (!file) return new Response('No file', { status: 400, headers: noStore });
    if (provider !== 'openai') {
      return new Response(JSON.stringify({ error: 'Gemini path not enabled in this starter. Use OpenAI for now.' }), {
        status: 400, headers: noStore
      });
    }

    const apiKey = platform?.env?.OPENAI_API_KEY;
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500, headers: noStore });

    // Guard: reject very large PDFs up front (helps avoid long hangs)
    const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
    if (typeof file.size === 'number' && file.size > MAX_BYTES) {
      return new Response(JSON.stringify({ error: `File too large (${file.size} bytes). Limit is ${MAX_BYTES} bytes.` }), {
        status: 413, headers: noStore
      });
    }

    // Show the model back to the UI
    const model = platform?.env?.OPENAI_MODEL || 'gpt-5';
    const baseURL = platform?.env?.OPENAI_BASE_URL;

    // Add timeouts & minimal retries so we fail fast instead of hanging
    const openai = new OpenAI({
      apiKey,
      baseURL,
      timeout: 60_000,  // 60s hard timeout per request to the API
      maxRetries: 0
    });

    let uploaded = null;

    try {
      // 1) Upload file → file_id (with its own timeout guard)
      uploaded = await openai.files.create({
        file,
        purpose: 'assistants'
      });

      // 2) Responses API + Structured Outputs
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

      // 3) Extract JSON string
      let outStr = resp?.output_text;
      if (!outStr) {
        try {
          const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
          if (first?.text) outStr = first.text;
        } catch { /* noop */ }
      }
      if (!outStr) outStr = JSON.stringify({ rows: [] });

      // 4) Harden + finalize
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

      return new Response(JSON.stringify({ model, rows: finalRows }), { headers: noStore });

    } finally {
      // Always try to delete the uploaded file on OpenAI to avoid buildup
      if (uploaded?.id) {
        try { await openai.files.del(uploaded.id); } catch { /* ignore cleanup errors */ }
      }
    }

  } catch (e) {
    // Convert OpenAI/Network timeouts into readable errors
    const status =
      (e && typeof e === 'object' && 'status' in e && e.status) ? e.status :
      (String(e).includes('timeout') ? 504 : 500);

    const body = (() => {
      try {
        return JSON.stringify({ error: (e?.message || String(e)) });
      } catch {
        return JSON.stringify({ error: 'Server error' });
      }
    })();

    return new Response(body, { status, headers: { 'cache-control': 'no-store', 'content-type': 'application/json' } });
  }
};
