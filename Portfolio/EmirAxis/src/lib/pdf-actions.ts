import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  buildContractPdf,
  buildInvoicePdf,
  buildPayslipPdf,
  buildWarningPdf,
  downloadPdf,
  uploadPdf,
  type PdfBranding,
} from "@/lib/pdf";

export async function generatePayslipPdfAction(payslipId: string, branding: PdfBranding, download = true) {
  const { data, error } = await supabase
    .from("payslips")
    .select("*, workers:worker_id(full_name, employee_code)")
    .eq("id", payslipId)
    .single();
  if (error) throw error;
  const w = data.workers as { full_name: string; employee_code: string | null };
  const lines = (Array.isArray(data.line_items) ? data.line_items : []) as { label: string; amount: number }[];
  const period = format(new Date(data.period_year, data.period_month - 1, 1), "MMMM yyyy");
  const doc = buildPayslipPdf(branding, {
    workerName: w.full_name,
    employeeCode: w.employee_code ?? "—",
    period,
    gross: Number(data.gross),
    deductions: Number(data.deductions),
    net: Number(data.net),
    currency: data.currency,
    lines: lines.length ? lines : [{ label: "Salary", amount: Number(data.gross) }],
  });
  const path = `payslips/${payslipId}.pdf`;
  const url = await uploadPdf(doc, path);
  await supabase.from("payslips").update({ pdf_url: url } as never).eq("id", payslipId);
  if (download) downloadPdf(doc, `payslip-${w.employee_code ?? payslipId}.pdf`);
  return url;
}

export async function generateInvoicePdfAction(invoiceId: string, branding: PdfBranding, download = true) {
  const { data: inv, error } = await supabase
    .from("invoices")
    .select("*, clients:client_id(legal_name)")
    .eq("id", invoiceId)
    .single();
  if (error) throw error;
  const { data: lines } = await supabase.from("invoice_lines").select("*").eq("invoice_id", invoiceId);
  const doc = buildInvoicePdf(branding, {
    reference: inv.reference ?? invoiceId.slice(0, 8),
    clientName: (inv.clients as { legal_name: string })?.legal_name ?? "Client",
    issueDate: inv.issue_date,
    dueDate: inv.due_date ?? inv.issue_date,
    currency: inv.currency,
    subtotal: Number(inv.subtotal),
    vatAmount: Number(inv.vat_amount),
    total: Number(inv.total),
    lines: (lines ?? []).map((l) => ({
      description: l.description,
      hours: Number(l.hours),
      rate: Number(l.rate),
      amount: Number(l.amount),
    })),
  });
  const path = `invoices/${invoiceId}.pdf`;
  const url = await uploadPdf(doc, path);
  await supabase.from("invoices").update({ pdf_url: url } as never).eq("id", invoiceId);
  if (download) downloadPdf(doc, `invoice-${inv.reference ?? invoiceId}.pdf`);
  return url;
}

export async function generateWarningPdfAction(warningId: string, branding: PdfBranding, download = true) {
  const { data, error } = await supabase.from("warning_letters").select("*, workers:worker_id(full_name)").eq("id", warningId).single();
  if (error) throw error;
  const w = data.workers as { full_name: string };
  const doc = buildWarningPdf(branding, {
    workerName: w.full_name,
    warningType: data.warning_type,
    incidentDate: data.incident_date,
    reason: data.reason,
    description: data.description ?? "",
    issuedDate: data.issued_at ? format(new Date(data.issued_at), "PP") : format(new Date(), "PP"),
  });
  const path = `warnings/${warningId}.pdf`;
  const url = await uploadPdf(doc, path);
  await supabase.from("warning_letters").update({ pdf_url: url } as never).eq("id", warningId);
  if (download) downloadPdf(doc, `warning-${warningId}.pdf`);
  return url;
}

export async function generateContractPdfAction(contractId: string, branding: PdfBranding, download = true) {
  const joined = await supabase
    .from("contract_documents")
    .select("*, workers:worker_id(full_name)")
    .eq("id", contractId)
    .single();

  let data = joined.data;
  if (joined.error) {
    const plain = await supabase.from("contract_documents").select("*").eq("id", contractId).single();
    if (plain.error) throw plain.error;
    data = plain.data;
  }
  if (!data) throw new Error("Contract not found");

  let workerName = (data.workers as { full_name: string } | null)?.full_name;
  if (!workerName && data.worker_id) {
    const { data: worker } = await supabase.from("workers").select("full_name").eq("id", data.worker_id).single();
    workerName = worker?.full_name;
  }
  const w = workerName ? { full_name: workerName } : null;
  const doc = buildContractPdf(branding, {
    title: data.title,
    workerName: w?.full_name ?? "Employee",
    body: data.body ?? "",
    signedDate: data.signed ? format(new Date(), "PP") : undefined,
  });
  const path = `contracts/${contractId}.pdf`;
  const url = await uploadPdf(doc, path);
  await supabase.from("contract_documents").update({ pdf_url: url } as never).eq("id", contractId);
  if (download) downloadPdf(doc, `contract-${contractId}.pdf`);
  return url;
}
