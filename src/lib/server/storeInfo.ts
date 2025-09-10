// src/lib/server/storeInfo.ts
import pdfParse from 'pdf-parse';

export async function extractStoreInfo(fileBuffer: Buffer): Promise<{
  store_number?: string;
  store_name?: string;
}> {
  try {
    // pdf-parse gives us a text dump; good enough for “top-right” heuristics.
    const data = await pdfParse(fileBuffer);
    const text = (data?.text || '').replace(/\r/g, '');
    // Look near the top of the doc.
    const head = text.split('\n').slice(0, 60).join('\n');

    const patterns: RegExp[] = [
      /Store\s*#?\s*(\d{3,6})\s*[-–—]\s*([A-Za-z0-9 &'()./+-]+)/i,
      /Store\s*No\.?\s*(\d{3,6})\s*[:\-]?\s*([A-Za-z0-9 &'()./+-]+)/i,
      /([A-Za-z0-9 &'()./+-]+)\s*\(\s*Store\s*(\d{3,6})\s*\)/i,
      /([A-Za-z0-9 &'()./+-]+)\s*[-–—]\s*Store\s*(\d{3,6})/i
    ];

    for (const re of patterns) {
      const m = re.exec(head);
      if (m) {
        // Normalize capture order: [number, name]
        const number = /\d/.test(m[1]) ? m[1] : m[2];
        const name = /\d/.test(m[1]) ? (m[2] ?? '') : (m[1] ?? '');
        return {
          store_number: (number || '').trim(),
          store_name: (name || '').trim()
        };
      }
    }

    // Fallback like "1234 - SOME STORE"
    const m2 = /(\d{3,6})\s*[-–—]\s*([A-Za-z][A-Za-z0-9 &'()./+-]+)/.exec(head);
    if (m2) return { store_number: m2[1], store_name: m2[2].trim() };
  } catch {
    // Swallow and return nothing—log stays useful without store details.
  }
  return {};
}
