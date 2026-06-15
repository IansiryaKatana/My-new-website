import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { stripHtmlToText } from "@/lib/templates.server";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const LINE_HEIGHT = 14;
const MAX_CHARS = 88;

function wrapLine(line: string): string[] {
  if (line.length <= MAX_CHARS) return [line];
  const words = line.split(/\s+/);
  const rows: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > MAX_CHARS) {
      if (current) rows.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) rows.push(current);
  return rows;
}

export async function buildPdfFromHtml(title: string, html: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  page.drawText(title, { x: MARGIN, y, size: 16, font: bold, color: rgb(0.02, 0.1, 0.21) });
  y -= 28;

  const body = stripHtmlToText(html);
  const lines = body.split("\n").flatMap((line) => wrapLine(line.trim()));

  for (const line of lines) {
    if (!line) {
      y -= LINE_HEIGHT / 2;
      continue;
    }
    if (y < MARGIN + LINE_HEIGHT) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
    page.drawText(line, { x: MARGIN, y, size: 10, font: regular, color: rgb(0.15, 0.2, 0.25) });
    y -= LINE_HEIGHT;
  }

  return pdf.save();
}
