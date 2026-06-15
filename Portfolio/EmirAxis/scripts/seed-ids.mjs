/** Deterministic UUIDs for seed data (hex-only, upsert-friendly). */
export function sid(group, seq = 1) {
  const g = Number(group).toString(16).padStart(4, "0");
  const n = Number(seq).toString(16).padStart(12, "0");
  return `${g}0000-0000-4000-8000-${n}`;
}
