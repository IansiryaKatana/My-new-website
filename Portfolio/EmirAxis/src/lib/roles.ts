import type { AppRole } from "@/lib/auth/AuthProvider";

export type { AppRole };

export const ALL_ROLES: AppRole[] = [
  "admin",
  "manager",
  "recruiter",
  "accountant",
  "payroll_officer",
  "pro",
  "agent",
  "worker",
  "client",
];

export const FINANCE_ROLES: AppRole[] = ["admin", "manager", "accountant", "payroll_officer"];
export const PRO_ROLES: AppRole[] = ["admin", "manager", "recruiter", "pro"];
export const OPS_ROLES: AppRole[] = ["admin", "manager", "recruiter"];
export const INSIGHTS_ROLES: AppRole[] = ["admin", "manager", "accountant", "payroll_officer"];

export function hasAny(roles: AppRole[], allowed: AppRole[]) {
  return allowed.some((r) => roles.includes(r));
}
