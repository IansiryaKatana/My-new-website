export type ReportGroup = "operational" | "recruitment" | "payroll" | "finance" | "hr";

export type ReportParamType = "none" | "dateRange" | "yearMonth" | "daysAhead";

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  group: ReportGroup;
  rpc: string;
  paramType: ReportParamType;
  prdSection?: string;
}

export const REPORT_GROUPS: { id: ReportGroup; label: string }[] = [
  { id: "operational", label: "Operational" },
  { id: "recruitment", label: "Recruitment" },
  { id: "payroll", label: "Payroll" },
  { id: "finance", label: "Finance" },
  { id: "hr", label: "HR" },
];

/** PRD §27 — full report catalog (48 reports). */
export const REPORT_CATALOG: ReportDefinition[] = [
  // Operational (13)
  { id: "active-employees", title: "Active employees", description: "All active and on-leave workers.", group: "operational", rpc: "report_active_employees", paramType: "none", prdSection: "Operational" },
  { id: "workers-by-client", title: "Employees by client", description: "Active placements and headcount per client.", group: "operational", rpc: "report_workers_by_client", paramType: "none" },
  { id: "workers-by-nationality", title: "Employees by nationality", description: "Headcount breakdown by nationality.", group: "operational", rpc: "report_workers_by_nationality", paramType: "none" },
  { id: "workers-by-visa", title: "Employees by visa status", description: "Valid, expiring, expired, or missing visa.", group: "operational", rpc: "report_workers_by_visa_status", paramType: "none" },
  { id: "workers-by-accommodation", title: "Employees by accommodation", description: "Occupancy per camp/building.", group: "operational", rpc: "report_workers_by_accommodation", paramType: "none" },
  { id: "workers-by-site", title: "Employees by deployment site", description: "Active workers grouped by job site.", group: "operational", rpc: "report_workers_by_site", paramType: "none" },
  { id: "pending-documents", title: "Employees pending documents", description: "Missing passport, visa scans, or expiry.", group: "operational", rpc: "report_workers_pending_documents", paramType: "none" },
  { id: "pending-medical", title: "Employees pending medical", description: "Medical fitness not passed or certified.", group: "operational", rpc: "report_workers_pending_medical", paramType: "none" },
  { id: "expiring-compliance", title: "Expiring visa / passport", description: "Compliance burn-down (90 days).", group: "operational", rpc: "get_compliance_expiries", paramType: "daysAhead" },
  { id: "absconding", title: "Absconding cases", description: "Workers marked absconded.", group: "operational", rpc: "report_absconding_workers", paramType: "none" },
  { id: "warnings-issued", title: "Warning letters issued", description: "Warnings issued in date range.", group: "operational", rpc: "report_warnings_issued", paramType: "dateRange" },
  { id: "complaints-category", title: "Complaints by category", description: "Open welfare issues by category.", group: "operational", rpc: "get_issues_by_category", paramType: "none" },
  { id: "client-complaints", title: "Client complaints frequency", description: "Open issues per client.", group: "operational", rpc: "report_issues_by_client", paramType: "none" },

  // Recruitment (9)
  { id: "candidates-source", title: "Candidates by source", description: "Applicant channel breakdown.", group: "recruitment", rpc: "get_candidates_by_source", paramType: "none" },
  { id: "recruitment-funnel", title: "Recruitment funnel", description: "Pipeline stages and volumes.", group: "recruitment", rpc: "get_recruitment_funnel", paramType: "none" },
  { id: "conversion", title: "Conversion rate", description: "Applicants per stage (% of total).", group: "recruitment", rpc: "report_recruitment_conversion", paramType: "none" },
  { id: "rejections", title: "Rejection reasons", description: "Rejected/withdrawn by source.", group: "recruitment", rpc: "report_candidate_rejections", paramType: "none" },
  { id: "time-to-deploy", title: "Time to deploy", description: "Average days from applicant to worker.", group: "recruitment", rpc: "report_time_to_deploy", paramType: "none" },
  { id: "agent-performance", title: "Agent performance", description: "Submissions and hires per agent.", group: "recruitment", rpc: "report_agent_performance", paramType: "none" },
  { id: "cost-per-hire", title: "Cost per hire", description: "Estimated agent commission exposure.", group: "recruitment", rpc: "report_cost_per_hire", paramType: "none" },
  { id: "open-manpower", title: "Open manpower requests", description: "Unfilled job orders.", group: "recruitment", rpc: "report_open_job_orders", paramType: "none" },
  { id: "jo-fulfilment", title: "Job order fulfilment rate", description: "Quantity vs filled per order.", group: "recruitment", rpc: "report_job_order_fulfilment", paramType: "none" },

  // Payroll (8)
  { id: "payroll-summary", title: "Monthly payroll summary", description: "Gross, deductions, net for period.", group: "payroll", rpc: "report_payroll_monthly_summary", paramType: "yearMonth" },
  { id: "salary-advances", title: "Salary advances", description: "Advance requests in period.", group: "payroll", rpc: "report_salary_advances", paramType: "dateRange" },
  { id: "deductions", title: "Deductions", description: "Worker deductions logged.", group: "payroll", rpc: "report_deductions", paramType: "dateRange" },
  { id: "overtime", title: "Overtime", description: "Timesheets with overtime hours.", group: "payroll", rpc: "report_overtime", paramType: "dateRange" },
  { id: "payroll-exceptions", title: "Payroll exceptions", description: "Missing bank/WPS or stale drafts.", group: "payroll", rpc: "report_payroll_exceptions", paramType: "none" },
  { id: "no-bank", title: "Employees without payment details", description: "Active workers missing IBAN.", group: "payroll", rpc: "report_workers_without_bank", paramType: "none" },
  { id: "client-salary-cost", title: "Client-wise salary cost", description: "Approved timesheet pay cost by client.", group: "payroll", rpc: "report_client_salary_cost", paramType: "dateRange" },
  { id: "wps-status", title: "WPS / export status", description: "Payroll run SIF export history.", group: "payroll", rpc: "report_wps_export_status", paramType: "none" },

  // Finance (11)
  { id: "revenue-client", title: "Revenue by client", description: "Approved timesheet billing by client.", group: "finance", rpc: "get_client_margin", paramType: "dateRange" },
  { id: "profit-client", title: "Profit by client", description: "Margin and margin % by client.", group: "finance", rpc: "get_client_margin", paramType: "dateRange" },
  { id: "profit-worker", title: "Profit by employee", description: "Margin per worker from timesheets.", group: "finance", rpc: "report_profit_by_worker", paramType: "dateRange" },
  { id: "outstanding-invoices", title: "Outstanding invoices", description: "Unpaid invoice balances.", group: "finance", rpc: "report_outstanding_invoices", paramType: "none" },
  { id: "overdue-clients", title: "Overdue clients", description: "Clients with past-due invoices.", group: "finance", rpc: "report_overdue_clients", paramType: "none" },
  { id: "visa-costs", title: "Visa cost recovery", description: "Visa processing costs in period.", group: "finance", rpc: "report_visa_costs", paramType: "dateRange" },
  { id: "accommodation-cost", title: "Accommodation cost", description: "Rent and bed occupancy.", group: "finance", rpc: "report_accommodation_costs", paramType: "none" },
  { id: "transport-cost", title: "Transport summary", description: "Fleet, drivers, and routes.", group: "finance", rpc: "report_transport_summary", paramType: "none" },
  { id: "uniform-cost", title: "Uniform / asset cost", description: "Issued uniforms and deductions.", group: "finance", rpc: "report_uniform_costs", paramType: "none" },
  { id: "gross-margin-month", title: "Monthly gross margin", description: "Revenue, cost, margin by month.", group: "finance", rpc: "report_margin_by_month", paramType: "dateRange" },
  { id: "margin-trend", title: "Net margin trend", description: "Margin trend (last 12 months).", group: "finance", rpc: "report_margin_trend", paramType: "none" },

  // HR (8)
  { id: "warnings-by-worker", title: "Warnings by employee", description: "Warning count per worker.", group: "hr", rpc: "report_warnings_by_worker", paramType: "none" },
  { id: "complaints-client-hr", title: "Complaints by client", description: "Open issues per client (HR view).", group: "hr", rpc: "report_issues_by_client", paramType: "none" },
  { id: "absence-rate", title: "Absence rate", description: "Absent days vs recorded days.", group: "hr", rpc: "report_absence_rate", paramType: "dateRange" },
  { id: "attendance-summary", title: "Attendance summary", description: "Present, absent, leave breakdown.", group: "hr", rpc: "report_attendance_summary", paramType: "dateRange" },
  { id: "turnover", title: "Turnover rate", description: "Exits vs active headcount.", group: "hr", rpc: "report_turnover_rate", paramType: "dateRange" },
  { id: "exits", title: "Resignations / terminations", description: "Workers exited in period.", group: "hr", rpc: "report_worker_exits", paramType: "dateRange" },
  { id: "high-risk", title: "High-risk employees", description: "Multiple warnings, critical issues, visa risk.", group: "hr", rpc: "report_high_risk_workers", paramType: "none" },
  { id: "workers-status", title: "Workers by status", description: "Headcount by employment status.", group: "hr", rpc: "get_workers_by_status", paramType: "none" },
];

export function getReportsByGroup(group: ReportGroup) {
  return REPORT_CATALOG.filter((r) => r.group === group);
}

export function getReportById(id: string) {
  return REPORT_CATALOG.find((r) => r.id === id);
}
