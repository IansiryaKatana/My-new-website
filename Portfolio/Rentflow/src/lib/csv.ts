export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
      row.push(cell.trim());
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      cell = "";
      if (ch === "\r") i++;
    } else {
      cell += ch;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c.length > 0)) rows.push(row);
  }

  return rows;
}

export function csvToObjects<T extends Record<string, string>>(text: string): T[] {
  const rows = parseCsv(text.trim());
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  return rows.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i] ?? "";
    });
    return obj as T;
  });
}

export function downloadCsvTemplate(filename: string, headers: string[], exampleRow?: string[]) {
  const lines = [headers.join(",")];
  if (exampleRow) lines.push(exampleRow.map((c) => (c.includes(",") ? `"${c}"` : c)).join(","));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const PROPERTY_CSV_HEADERS = [
  "title",
  "community",
  "building",
  "unit_no",
  "property_type",
  "beds",
  "baths",
  "sqft",
  "rent_yearly",
  "cheques_accepted",
  "furnished",
  "status",
  "available_from",
  "description",
] as const;

export const TENANCY_CSV_HEADERS = [
  "tenant_email",
  "property_title",
  "start_date",
  "end_date",
  "annual_rent",
  "cheques",
  "security_deposit",
  "ejari_number",
] as const;
