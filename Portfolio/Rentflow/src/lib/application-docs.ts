export const APPLICATION_DOC_TYPES = [
  "emirates_id",
  "passport",
  "visa",
  "salary_certificate",
  "bank_statement",
  "trade_license",
  "other",
] as const;

export type ApplicationDocType = (typeof APPLICATION_DOC_TYPES)[number];

export const REQUIRED_APPLICATION_DOCS = ["emirates_id", "passport", "salary_certificate"] as const;

export function formatDocType(type: string) {
  return type.replace(/_/g, " ");
}
