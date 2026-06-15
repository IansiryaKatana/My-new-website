/** ERP/CRM semantic categories for standardized status badge colors. */
export type StatusSemantic = "success" | "warning" | "info" | "danger" | "neutral";

export const STATUS_SEMANTIC_LABELS: Record<StatusSemantic, string> = {
  success: "Success",
  warning: "Pending / Warning",
  info: "In progress / Info",
  danger: "Rejected / Danger",
  neutral: "Closed / Neutral",
};

/**
 * Maps every domain status value to a semantic color category.
 * Unknown values fall back to neutral.
 */
export const STATUS_SEMANTIC_MAP: Record<string, StatusSemantic> = {
  // application_status
  submitted: "info",
  docs_review: "warning",
  contract_sent: "warning",
  approved: "success",
  rejected: "danger",
  withdrawn: "neutral",

  // payment_status
  scheduled: "warning",
  pending: "warning",
  cleared: "success",
  bounced: "danger",
  paid: "success",
  refunded: "info",
  cancelled: "neutral",

  // property_status
  draft: "neutral",
  available: "success",
  reserved: "warning",
  rented: "info",
  off_market: "neutral",

  // tenancy_status
  upcoming: "info",
  active: "success",
  notice_given: "warning",
  ended: "neutral",
  terminated: "danger",

  // ticket_status
  open: "info",
  in_progress: "info",
  awaiting_tenant: "warning",
  resolved: "success",
  closed: "neutral",

  // viewing_status
  requested: "warning",
  confirmed: "info",
  completed: "success",
  no_show: "danger",

  // renewal_status
  offered: "info",
  accepted: "success",
  declined: "danger",
  expired: "neutral",

  // ticket_priority / severity
  low: "neutral",
  medium: "warning",
  high: "danger",
  urgent: "danger",

  // misc workflow labels
  verified: "success",
  new: "info",
  connected: "success",
  disconnected: "neutral",
  onboarding: "info",
};

export function normalizeStatusKey(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, "_");
}

export function getStatusSemantic(status: string, override?: StatusSemantic): StatusSemantic {
  if (override) return override;
  return STATUS_SEMANTIC_MAP[normalizeStatusKey(status)] ?? "neutral";
}

export function formatStatusLabel(status: string): string {
  return normalizeStatusKey(status).replace(/_/g, " ");
}
