import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export type SupportedMimeType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function isSupportedMimeType(mimetype: string): mimetype is SupportedMimeType {
  return (
    mimetype === "application/pdf" ||
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

/**
 * Extracts all text content from a PDF or DOCX buffer.
 *
 * Note: both pdf-parse and mammoth pull every text run in the document,
 * including text that is visually hidden (white-on-white, near-zero font
 * size, OOXML "vanish" runs, off-page PDF text, etc). That is intentional
 * for this demo: the grading prompt downstream receives whatever text
 * extraction surfaces, hidden or not.
 */
export async function extractText(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}
