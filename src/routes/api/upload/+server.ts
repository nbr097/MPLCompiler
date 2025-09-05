import OpenAI from 'openai';
import type { RequestHandler } from './$types';

// Pure JSON Schema (no "name" here)
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
} as const;

const baseInstructions =
  `You are a retail inventory parser. Given an inventory document (may be a PDF with tables),
extract ONLY the rows where SOH ≤ MPL. Ignore rows where MPL is missing or SOH is blank.
For each matched row return: article (ID), description (clean text), mpl (number), soh (number).
Return JSON matching the provided schema exactly.`;

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const form = await request.formData();
    const provider = (form.get('provider') as string) || 'openai';
    const file = form.get('file') as File | null;

    if (!file) return new Response('No file', { status: 400 });
    if (provider !== 'openai') {
      return new Response(
        JSON.stringify({ error: 'Gemini path is not enabled on Cloudflare in this starter. Use OpenAI for now.' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const apiKey = platform?.env?.OPENAI_API_KEY;
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500 });

    const model = platform?.env?.OPENAI_MODEL || 'gpt-4o-mini';
    const openai = new OpenAI({ apiKey, baseURL: platform?.env?.OPENAI_BASE_URL });

    // Upload file, then reference by id
    const uploaded = await openai.files.create({
      file,                // File from FormData (Workers-compatible)
      purpose: 'assistants'
    });

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
      // ✅ Responses API requires a name under text.format
      text: {
        format: {
          type: 'json_schema',
          name: 'InventoryRows',           // <— add this
          json_schema: {
            schema: jsonSchema,
            strict: true
          }
        }
      }
    });

    const out = (resp as any).output_text ?? JSON.stringify({ rows: [] });
    return new Response(out, { headers: { 'content-type': 'application/json' } });

  } catch (e: any) {
    return new Response(e?.message ?? 'Server error', { status: 500 });
  }
};
