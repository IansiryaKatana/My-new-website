import { jsPDF } from "jspdf";
import type { Branding } from "@/lib/branding/BrandingProvider";
import { supabase } from "@/integrations/supabase/client";

export type PdfBranding = Pick<Branding, "company_name" | "support_email" | "support_phone" | "tagline">;

function header(doc: jsPDF, branding: PdfBranding, title: string) {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(branding.company_name, 14, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(title, 14, 26);
  if (branding.support_email) doc.text(branding.support_email, 14, 32);
  doc.setDrawColor(180);
  doc.line(14, 36, 196, 36);
}

function footer(doc: jsPDF, page: number) {
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString("en-AE")} · Page ${page}`, 14, 285);
  doc.setTextColor(0);
}

export function downloadPdf(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export async function uploadPdf(doc: jsPDF, storagePath: string): Promise<string> {
  const blob = doc.output("blob");
  const { error } = await supabase.storage.from("generated-pdfs").upload(storagePath, blob, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw error;
  const { data } = await supabase.storage.from("generated-pdfs").createSignedUrl(storagePath, 60 * 60 * 24 * 365);
  if (!data?.signedUrl) throw new Error("Could not create PDF URL");
  return data.signedUrl;
}

export function buildPayslipPdf(
  branding: PdfBranding,
  data: {
    workerName: string;
    employeeCode: string;
    period: string;
    gross: number;
    deductions: number;
    net: number;
    currency: string;
    lines: { label: string; amount: number }[];
  },
) {
  const doc = new jsPDF();
  header(doc, branding, "Salary Payslip");
  let y = 46;
  doc.setFontSize(11);
  const rows: [string, string][] = [
    ["Employee", data.workerName],
    ["Code", data.employeeCode],
    ["Period", data.period],
    ["Currency", data.currency],
  ];
  for (const [k, v] of rows) {
    doc.text(`${k}:`, 14, y);
    doc.text(v, 60, y);
    y += 7;
  }
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("Earnings", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  for (const line of data.lines) {
    doc.text(line.label, 18, y);
    doc.text(line.amount.toFixed(2), 150, y, { align: "right" });
    y += 6;
  }
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text(`Gross: ${data.currency} ${data.gross.toFixed(2)}`, 14, y);
  y += 7;
  doc.text(`Deductions: ${data.currency} ${data.deductions.toFixed(2)}`, 14, y);
  y += 7;
  doc.setFontSize(12);
  doc.text(`Net pay: ${data.currency} ${data.net.toFixed(2)}`, 14, y);
  footer(doc, 1);
  return doc;
}

export function buildInvoicePdf(
  branding: PdfBranding,
  data: {
    reference: string;
    clientName: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    subtotal: number;
    vatAmount: number;
    total: number;
    lines: { description: string; hours: number; rate: number; amount: number }[];
  },
) {
  const doc = new jsPDF();
  header(doc, branding, "Tax Invoice");
  let y = 46;
  doc.setFontSize(10);
  doc.text(`Invoice: ${data.reference}`, 14, y);
  y += 6;
  doc.text(`Bill to: ${data.clientName}`, 14, y);
  y += 6;
  doc.text(`Issue: ${data.issueDate}  ·  Due: ${data.dueDate}`, 14, y);
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Description", 14, y);
  doc.text("Hrs", 120, y);
  doc.text("Rate", 140, y);
  doc.text("Amount", 170, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  for (const line of data.lines) {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.text(line.description.slice(0, 48), 14, y);
    doc.text(String(line.hours), 120, y);
    doc.text(line.rate.toFixed(2), 140, y);
    doc.text(line.amount.toFixed(2), 170, y);
    y += 6;
  }
  y += 6;
  doc.text(`Subtotal: ${data.currency} ${data.subtotal.toFixed(2)}`, 120, y, { align: "right" });
  y += 6;
  doc.text(`VAT: ${data.currency} ${data.vatAmount.toFixed(2)}`, 120, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${data.currency} ${data.total.toFixed(2)}`, 120, y, { align: "right" });
  footer(doc, 1);
  return doc;
}

export function buildWarningPdf(
  branding: PdfBranding,
  data: {
    workerName: string;
    warningType: string;
    incidentDate: string;
    reason: string;
    description: string;
    issuedDate: string;
  },
) {
  const doc = new jsPDF();
  header(doc, branding, "Disciplinary Warning Letter");
  let y = 50;
  doc.setFontSize(11);
  doc.text(`To: ${data.workerName}`, 14, y);
  y += 10;
  doc.text(`Date: ${data.issuedDate}`, 14, y);
  y += 10;
  doc.text(`Warning type: ${data.warningType.replace(/_/g, " ")}`, 14, y);
  y += 8;
  doc.text(`Incident date: ${data.incidentDate}`, 14, y);
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Reason:", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const reasonLines = doc.splitTextToSize(data.reason, 180);
  doc.text(reasonLines, 14, y);
  y += reasonLines.length * 6 + 6;
  if (data.description) {
    doc.setFont("helvetica", "bold");
    doc.text("Details:", 14, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(data.description, 180);
    doc.text(descLines, 14, y);
  }
  y += 20;
  doc.text("Acknowledged by employee: _________________________", 14, y);
  y += 10;
  doc.text("HR / Management: _________________________", 14, y);
  footer(doc, 1);
  return doc;
}

export function buildContractPdf(
  branding: PdfBranding,
  data: { title: string; workerName: string; body: string; signedDate?: string },
) {
  const doc = new jsPDF();
  header(doc, branding, data.title);
  let y = 46;
  doc.setFontSize(11);
  doc.text(`Party: ${data.workerName}`, 14, y);
  y += 10;
  const bodyLines = doc.splitTextToSize(data.body || "—", 180);
  doc.text(bodyLines, 14, y);
  if (data.signedDate) {
    y += bodyLines.length * 5 + 12;
    doc.text(`Signed: ${data.signedDate}`, 14, y);
  }
  footer(doc, 1);
  return doc;
}
