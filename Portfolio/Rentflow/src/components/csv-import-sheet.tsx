import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { FormSheet } from "@/components/ui/form-sheet";
import { Button } from "@/components/ui/button";
import { csvToObjects, downloadCsvTemplate } from "@/lib/csv";

type CsvImportSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  templateFilename: string;
  headers: readonly string[];
  exampleRow?: string[];
  onImport: (rows: Record<string, string>[]) => Promise<{ imported: number; errors: string[] }>;
};

export function CsvImportSheet({
  open,
  onOpenChange,
  title,
  description,
  templateFilename,
  headers,
  exampleRow,
  onImport,
}: CsvImportSheetProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setResult(null);
    try {
      const text = await file.text();
      const rows = csvToObjects(text);
      const res = await onImport(rows);
      setResult(res);
    } catch (e) {
      setResult({ imported: 0, errors: [(e as Error).message] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={(v) => {
        if (!v) setResult(null);
        onOpenChange(v);
      }}
      title={title}
      description={description}
      footer={
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => downloadCsvTemplate(templateFilename, [...headers], exampleRow)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download CSV template
        </Button>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 py-8 text-center hover:bg-muted/40">
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{loading ? "Importing…" : "Upload filled CSV"}</span>
          <span className="mt-1 text-xs text-muted-foreground">.csv files only</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            disabled={loading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {result && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <p className="text-foreground">Imported {result.imported} record(s).</p>
            {result.errors.length > 0 && (
              <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-destructive">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </FormSheet>
  );
}
