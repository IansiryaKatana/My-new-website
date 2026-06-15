export function personInitials(name: string | null | undefined, fallback = "?") {
  if (!name?.trim()) return fallback;
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || fallback;
}
