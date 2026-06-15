import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormSheet } from "@/components/ui/form-sheet";
import { SteppedForm } from "@/components/stepped-form";
import { FileUploadField } from "@/components/file-upload-field";
import { BulkActionBar } from "@/components/bulk-action-bar";
import { CsvImportSheet } from "@/components/csv-import-sheet";
import { useBulkSelect } from "@/hooks/use-bulk-select";
import { StaffShell } from "@/components/staff-shell";
import { listStaffProperties, upsertProperty, deleteProperty } from "@/lib/properties.functions";
import { bulkDeleteProperties, importPropertiesCsv } from "@/lib/import.functions";
import { PROPERTY_CSV_HEADERS } from "@/lib/csv";
import { formatAed, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/properties/")({
  head: () => ({ meta: [{ title: "Properties — Rentflow" }] }),
  component: PropertiesPage,
});

type PropertyRow = Awaited<ReturnType<typeof listStaffProperties>>[number];

const propertyTypes = ["apartment", "villa", "townhouse", "penthouse", "studio", "office", "retail"] as const;
const statuses = ["draft", "available", "reserved", "rented", "off_market"] as const;

function PropertiesPage() {
  const fetchList = useServerFn(listStaffProperties);
  const q = useQuery({ queryKey: ["staffProperties"], queryFn: () => fetchList() });
  const [open, setOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyRow | null>(null);
  const bulk = useBulkSelect(q.data ?? []);
  const qc = useQueryClient();
  const bulkDelete = useServerFn(bulkDeleteProperties);
  const importCsv = useServerFn(importPropertiesCsv);

  const deleteMut = useMutation({
    mutationFn: (ids: string[]) => bulkDelete({ data: { ids } }),
    onSuccess: () => {
      bulk.clear();
      qc.invalidateQueries({ queryKey: ["staffProperties"] });
    },
  });

  return (
    <StaffShell title="Properties">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{q.data ? `${q.data.length} properties` : "Loading…"}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setCsvOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New property
          </Button>
        </div>
      </div>

      <BulkActionBar count={bulk.selectedIds.length} onClear={bulk.clear}>
        <Button
          size="sm"
          variant="destructive"
          disabled={deleteMut.isPending}
          onClick={() => {
            if (confirm(`Delete ${bulk.selectedIds.length} properties?`)) deleteMut.mutate(bulk.selectedIds);
          }}
        >
          Delete selected
        </Button>
      </BulkActionBar>

      {q.data && q.data.length > 0 && (
        <div className="mb-3 flex items-center gap-2 text-sm">
          <Checkbox checked={bulk.allSelected} onCheckedChange={bulk.toggleAll} id="select-all-props" />
          <label htmlFor="select-all-props" className="text-muted-foreground">Select all</label>
        </div>
      )}

      {q.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : q.isError ? (
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      ) : q.data && q.data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {q.data.map((p) => (
            <PropertyCard
              key={p.id}
              row={p}
              selected={bulk.selected.has(p.id)}
              onToggle={() => bulk.toggle(p.id)}
              onEdit={() => { setEditing(p); setOpen(true); }}
            />
          ))}
        </div>
      ) : (
        <EmptyState onCreate={() => setOpen(true)} />
      )}

      <PropertySheet open={open} onOpenChange={setOpen} initial={editing} />
      <CsvImportSheet
        open={csvOpen}
        onOpenChange={setCsvOpen}
        title="Import properties"
        description="Download the template, fill in your listings, then upload."
        templateFilename="properties-template.csv"
        headers={PROPERTY_CSV_HEADERS}
        exampleRow={["Marina 2BR", "Dubai Marina", "Marina Gate", "1204", "apartment", "2", "2", "1100", "120000", "4", "true", "available", "2026-07-01", "Sea view"]}
        onImport={async (rows) => {
          const result = await importCsv({ data: { rows } });
          qc.invalidateQueries({ queryKey: ["staffProperties"] });
          return result;
        }}
      />
    </StaffShell>
  );
}

function PropertyCard({
  row,
  selected,
  onToggle,
  onEdit,
}: {
  row: PropertyRow;
  selected: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const qc = useQueryClient();
  const remove = useServerFn(deleteProperty);
  const mut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staffProperties"] }),
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start gap-2">
          <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-1" />
          <div className="min-w-0 flex-1">
            <Link to="/properties/$id" params={{ id: row.id }} className="font-semibold text-card-foreground hover:underline">
              {row.title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {row.community}
              {row.building ? ` · ${row.building}` : ""}
            </p>
          </div>
          <StatusBadge status={row.status} />
        </div>
        {row.cover_image && (
          <img src={row.cover_image} alt="" className="mb-3 h-28 w-full rounded-md object-cover" />
        )}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div><div className="text-foreground">{row.beds}</div>Beds</div>
          <div><div className="text-foreground">{row.property_type}</div>Type</div>
          <div><div className="text-foreground">{formatAed(Number(row.rent_yearly))}</div>Yearly</div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">Available {formatDate(row.available_from)}</div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={onEdit}>
            <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${row.title}"?`)) mut.mutate(row.id); }} disabled={mut.isPending}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <h3 className="text-base font-semibold text-foreground">No properties yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Add listings manually or import from CSV.</p>
      <Button className="mt-4" onClick={onCreate}><Plus className="mr-2 h-4 w-4" /> Create property</Button>
    </div>
  );
}

function PropertySheet({ open, onOpenChange, initial }: { open: boolean; onOpenChange: (v: boolean) => void; initial: PropertyRow | null }) {
  const qc = useQueryClient();
  const save = useServerFn(upsertProperty);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => defaultForm(initial));

  if (open && (form._loadedId ?? null) !== (initial?.id ?? null)) {
    setForm(defaultForm(initial));
    setStep(0);
  }

  const mut = useMutation({
    mutationFn: () =>
      save({
        data: {
          id: initial?.id,
          title: form.title.trim(),
          community: form.community.trim(),
          building: form.building.trim() || null,
          unit_no: form.unit_no.trim() || null,
          property_type: form.property_type,
          beds: Number(form.beds) || 0,
          baths: Number(form.baths) || 0,
          sqft: form.sqft ? Number(form.sqft) : null,
          rent_yearly: Number(form.rent_yearly) || 0,
          cheques_accepted: Number(form.cheques_accepted) || 4,
          furnished: form.furnished,
          amenities: [],
          status: form.status,
          description: form.description.trim() || null,
          available_from: form.available_from || null,
          cover_image: form.cover_image.trim() || null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staffProperties"] });
      onOpenChange(false);
    },
  });

  const steps = [
    {
      id: "location",
      title: "Location",
      validate: () => Boolean(form.title.trim() && form.community.trim()),
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
          </Field>
          <Field label="Community"><Input value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} /></Field>
          <Field label="Building"><Input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} /></Field>
          <Field label="Unit"><Input value={form.unit_no} onChange={(e) => setForm({ ...form, unit_no: e.target.value })} /></Field>
          <Field label="Type">
            <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v as typeof form.property_type })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{propertyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
      ),
    },
    {
      id: "specs",
      title: "Specs & rent",
      validate: () => Number(form.rent_yearly) > 0,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Beds"><Input type="number" min={0} value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} /></Field>
          <Field label="Baths"><Input type="number" min={0} value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} /></Field>
          <Field label="Sqft"><Input type="number" min={0} value={form.sqft} onChange={(e) => setForm({ ...form, sqft: e.target.value })} /></Field>
          <Field label="Yearly rent (AED)"><Input type="number" min={0} value={form.rent_yearly} onChange={(e) => setForm({ ...form, rent_yearly: e.target.value })} /></Field>
          <Field label="Cheques"><Input type="number" min={1} max={12} value={form.cheques_accepted} onChange={(e) => setForm({ ...form, cheques_accepted: e.target.value })} /></Field>
          <Field label="Available from"><Input type="date" value={form.available_from} onChange={(e) => setForm({ ...form, available_from: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch checked={form.furnished} onCheckedChange={(v) => setForm({ ...form, furnished: v })} id="furnished" />
            <Label htmlFor="furnished">Furnished</Label>
          </div>
        </div>
      ),
    },
    {
      id: "media",
      title: "Media & publish",
      content: (
        <div className="space-y-4">
          <FileUploadField
            label="Cover image"
            bucket="property-images"
            pathPrefix="covers"
            value={form.cover_image}
            onChange={(url) => setForm({ ...form, cover_image: url })}
            accept="image/*"
          />
          <Field label="Description">
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={5000} />
          </Field>
          {mut.isError && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
        </div>
      ),
    },
  ];

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Edit property" : "New property"}
      description="Step through location, specs, then photos."
    >
      <SteppedForm
        steps={steps}
        stepIndex={step}
        onStepChange={setStep}
        onSubmit={() => mut.mutate()}
        submitting={mut.isPending}
        submitLabel={initial ? "Save changes" : "Create property"}
        onCancel={() => onOpenChange(false)}
      />
    </FormSheet>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function defaultForm(initial: PropertyRow | null) {
  return {
    _loadedId: initial?.id ?? null,
    title: initial?.title ?? "",
    community: initial?.community ?? "",
    building: initial?.building ?? "",
    unit_no: initial?.unit_no ?? "",
    property_type: (initial?.property_type ?? "apartment") as (typeof propertyTypes)[number],
    beds: String(initial?.beds ?? 1),
    baths: String((initial as PropertyRow & { baths?: number } | null)?.baths ?? 1),
    sqft: String((initial as PropertyRow & { sqft?: number } | null)?.sqft ?? ""),
    rent_yearly: String(initial?.rent_yearly ?? ""),
    cheques_accepted: String((initial as PropertyRow & { cheques_accepted?: number } | null)?.cheques_accepted ?? 4),
    available_from: initial?.available_from ?? "",
    status: (initial?.status ?? "draft") as (typeof statuses)[number],
    cover_image: initial?.cover_image ?? "",
    description: (initial as PropertyRow & { description?: string } | null)?.description ?? "",
    furnished: (initial as PropertyRow & { furnished?: boolean } | null)?.furnished ?? false,
  };
}
