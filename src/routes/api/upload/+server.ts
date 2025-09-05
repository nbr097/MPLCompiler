import OpenAI from 'openai';

// ---- Strict JSON Schema for the table we want back ----
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

// ---- Prompt given to the model ----
const baseInstructions = `
You are a retail inventory parser. Given an inventory document (often a PDF with tables),
extract ONLY the rows where SOH ≤ MPL. Ignore rows where MPL is missing or SOH is blank.
For each matched row return: article (ID), description (clean text), mpl (number), soh (number).
Return JSON matching the provided schema exactly.
`;

export const POST = async ({ request, platform }) => {
  try {
    const form = await request.formData();
    const provider = (form.get('provider') || 'openai').toString();
    const file = form.get('file');

    if (!file) {
      return new Response('No file', { status: 400 });
    }

    if (provider !== 'openai') {
      return new Response(
        JSON.stringify({ error: 'Gemini path is not enabled in this starter. Use OpenAI for now.' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const apiKey = platform?.env?.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response('Missing OPENAI_API_KEY', { status: 500 });
    }

    const model = platform?.env?.OPENAI_MODEL || 'gpt-4o-mini';
    const baseURL = platform?.env?.OPENAI_BASE_URL; // optional override

    const openai = new OpenAI({ apiKey, baseURL });

    // 1) Upload the file to OpenAI and get a file_id
    const uploaded = await openai.files.create({
      file,                 // File object from FormData (Workers-compatible)
      purpose: 'assistants' // works for Responses API file references
    });

    // 2) Call the Responses API with Structured Outputs (new shape under text.format)
    const resp = await openai.responses.create({
      model,
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: baseInstructions },
            { type: 'input_file', file_id: uploaded.id }
          ]
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'InventoryRows', // REQUIRED at this level
          schema: jsonSchema,    // pure JSON Schema object
          strict: true
        }
      }
    });

    // 3) Structured outputs typically return as a JSON string in output_text
    let out = resp?.output_text;

    // Fallback for SDK shape differences, just in case
    if (!out) {
      try {
        const first = resp?.output?.[0]?.content?.find?.(p => p.type === 'output_text');
        if (first?.text) out = first.text;
      } catch {
        // ignore
      }
    }

    if (!out) {
      out = JSON.stringify({ rows: [] });
    }

    return new Response(out, { headers: { 'content-type': 'application/json' } });
  } catch (e) {
  // OpenAI often returns a JSON body with helpful info
  try {
    const detail = e?.response ? await e.response.text() : e?.message || String(e);
    return new Response(detail, { status: e?.status || 500, headers: { 'content-type': 'application/json' } });
  } catch {
    return new Response(e?.message ?? 'Server error', { status: 500 });
  }
};
