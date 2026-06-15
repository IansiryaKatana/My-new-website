import { supabase } from "@/integrations/supabase/client";

export async function convertCandidateToWorker(candidateId: string) {
  const { data, error } = await supabase.rpc("convert_candidate_to_worker", {
    _candidate_id: candidateId,
  });
  if (error) throw error;
  return data as string;
}

export async function getWorkerCompliance(workerId: string) {
  const { data, error } = await supabase.rpc("get_worker_compliance", {
    _worker_id: workerId,
  });
  if (error) throw error;
  return data as {
    ok: boolean;
    score?: number;
    complete?: boolean;
    missing?: string[];
    error?: string;
  };
}

export async function generatePayrollRun(year: number, month: number) {
  const { data, error } = await supabase.rpc("generate_payroll_run", {
    _year: year,
    _month: month,
  });
  if (error) throw error;
  return data as string;
}

export async function issuePayslipsFromPayroll(runId: string) {
  const { data, error } = await supabase.rpc("issue_payslips_from_payroll", {
    _run_id: runId,
  });
  if (error) throw error;
  return data as number;
}

export async function generateInvoiceFromTimesheets(
  clientId: string,
  from: string,
  to: string,
  dueDays = 30,
) {
  const { data, error } = await supabase.rpc("generate_invoice_from_timesheets", {
    _client_id: clientId,
    _from: from,
    _to: to,
    _due_days: dueDays,
  });
  if (error) throw error;
  return data as string;
}

export async function runComplianceAlerts() {
  const { data, error } = await supabase.rpc("run_compliance_alerts");
  if (error) throw error;
  return data as number;
}

export function buildWpsSif(
  period: string,
  rows: {
    wps_personal_id: string | null;
    iban: string | null;
    routing_code: string | null;
    full_name: string;
    gross: number;
  }[],
) {
  const [year, month] = period.split("-");
  const periodCode = `${year}${month}`;
  const lines: string[] = [];
  let total = 0;
  for (const w of rows) {
    total += w.gross;
    lines.push(
      ["EDR", w.wps_personal_id ?? "", w.iban ?? "", w.routing_code ?? "", w.gross.toFixed(2), periodCode, "30", w.full_name].join(
        ",",
      ),
    );
  }
  lines.unshift(["SCR", periodCode, String(rows.length), total.toFixed(2), "AED"].join(","));
  return { content: lines.join("\r\n"), periodCode, total };
}
