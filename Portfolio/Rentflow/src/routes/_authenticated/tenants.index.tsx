import { createFileRoute, createLink, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CsvImportSheet } from "@/components/csv-import-sheet";
import { BulkActionBar } from "@/components/bulk-action-bar";
import { useBulkSelect } from "@/hooks/use-bulk-select";
import { importTenanciesCsv } from "@/lib/import.functions";
import { TENANCY_CSV_HEADERS } from "@/lib/csv";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffShell } from "@/components/staff-shell";
import { UserAvatar } from "@/components/user-avatar";
import { listTenancies } from "@/lib/tenancies.functions";
import { formatAed, formatDate } from "@/lib/format";

const TenancyTableRow = createLink(TableRow);

export const Route = createFileRoute("/_authenticated/tenants/")({
  head: () => ({ meta: [{ title: "Tenants — Rental OS" }] }),
  component: TenantsPage,
});

function TenantsPage() {
  const fetch = useServerFn(listTenancies);
  const importCsv = useServerFn(importTenanciesCsv);
  const q = useQuery({ queryKey: ["tenancies"], queryFn: () => fetch() });
  const [csvOpen, setCsvOpen] = useState(false);
  const bulk = useBulkSelect(q.data ?? []);

  return (
    <StaffShell title="Tenants">
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={() => setCsvOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Import tenancies CSV
        </Button>
      </div>
      <BulkActionBar count={bulk.selectedIds.length} onClear={bulk.clear} />
      <Card>
        <CardContent className="p-0">
          {q.isLoading ? (
            <>
              <div className="space-y-3 p-4 lg:hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-lg" />
                ))}
              </div>
              <div className="hidden space-y-2 p-6 lg:block">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </>
          ) : q.isError ? (
            <p className="p-6 text-sm text-destructive">{(q.error as Error).message}</p>
          ) : q.data && q.data.length > 0 ? (
            <>
              <div className="space-y-3 p-4 lg:hidden">
                {q.data.map((t) => (
                  <TenancyCard
                    key={t.id}
                    row={t}
                    selected={bulk.selected.has(t.id)}
                    onToggle={() => bulk.toggle(t.id)}
                  />
                ))}
              </div>
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10" />
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead className="text-right">Rent</TableHead>
                      <TableHead>Cheques</TableHead>
                      <TableHead>Ejari</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {q.data.map((t) => (
                      <TenancyRow
                        key={t.id}
                        row={t}
                        selected={bulk.selected.has(t.id)}
                        onToggle={() => bulk.toggle(t.id)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <p className="p-12 text-center text-sm text-muted-foreground">No tenancies yet.</p>
          )}
        </CardContent>
      </Card>
      <CsvImportSheet
        open={csvOpen}
        onOpenChange={setCsvOpen}
        title="Import tenancies"
        description="Tenant must already exist (by email). Property matched by title."
        templateFilename="tenancies-template.csv"
        headers={TENANCY_CSV_HEADERS}
        exampleRow={["tenant@example.com", "Marina 2BR", "2026-07-01", "2027-06-30", "120000", "4", "6000", ""]}
        onImport={async (rows) => importCsv({ data: { rows } })}
      />
    </StaffShell>
  );
}

type TenancyRowData = NonNullable<Awaited<ReturnType<typeof listTenancies>>>[number];

type TenancyDisplay = {
  tenantName: string;
  tenantContact: string;
  propertyTitle: string;
  propertyMeta: string;
};

function getTenancyDisplay(row: TenancyRowData): TenancyDisplay {
  const tenant = row.profiles as { full_name?: string; phone?: string; email?: string } | null;
  const prop = row.properties as { title?: string; community?: string; unit_no?: string } | null;
  const propertyMeta = [prop?.community, prop?.unit_no ? `Unit ${prop.unit_no}` : null].filter(Boolean).join(" · ");

  return {
    tenantName: tenant?.full_name ?? "—",
    tenantContact: tenant?.phone ?? tenant?.email ?? "",
    propertyTitle: prop?.title ?? "—",
    propertyMeta,
  };
}

function TenancyRow({
  row,
  selected,
  onToggle,
}: {
  row: TenancyRowData;
  selected: boolean;
  onToggle: () => void;
}) {
  const tenant = row.profiles as { full_name?: string; phone?: string; email?: string; avatar_url?: string | null } | null;
  const display = getTenancyDisplay(row);

  return (
    <TenancyTableRow
      to="/tenants/$id"
      params={{ id: row.id }}
      className="cursor-pointer"
    >
      <TableCell
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Checkbox checked={selected} onCheckedChange={onToggle} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <UserAvatar
            name={tenant?.full_name}
            email={tenant?.email}
            src={tenant?.avatar_url}
            className="h-9 w-9"
          />
          <div className="min-w-0">
            <div className="font-medium text-foreground">{display.tenantName}</div>
            {display.tenantContact ? (
              <div className="text-xs text-muted-foreground">{display.tenantContact}</div>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium text-foreground">{display.propertyTitle}</div>
        {display.propertyMeta ? (
          <div className="text-xs text-muted-foreground">{display.propertyMeta}</div>
        ) : null}
      </TableCell>
      <TableCell className="text-sm">
        {formatDate(row.start_date)} → {formatDate(row.end_date)}
      </TableCell>
      <TableCell className="text-right font-medium">{formatAed(Number(row.annual_rent))}</TableCell>
      <TableCell>{row.cheques}</TableCell>
      <TableCell className="text-xs">{row.ejari_number ?? "—"}</TableCell>
      <TableCell>
        <StatusBadge status={row.status} />
      </TableCell>
    </TenancyTableRow>
  );
}

function TenancyCard({
  row,
  selected,
  onToggle,
}: {
  row: TenancyRowData;
  selected: boolean;
  onToggle: () => void;
}) {
  const tenant = row.profiles as { full_name?: string; email?: string; avatar_url?: string | null } | null;
  const display = getTenancyDisplay(row);

  return (
    <Card className="overflow-hidden transition-colors hover:bg-muted/40">
      <CardContent className="flex items-start gap-3 p-4">
        <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-1 shrink-0" />
        <Link to="/tenants/$id" params={{ id: row.id }} className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={tenant?.full_name}
              email={tenant?.email}
              src={tenant?.avatar_url}
              className="h-10 w-10 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{display.tenantName}</div>
                  <div className="truncate text-sm text-muted-foreground">{display.propertyTitle}</div>
                  {display.propertyMeta ? (
                    <div className="truncate text-xs text-muted-foreground">{display.propertyMeta}</div>
                  ) : null}
                </div>
                <StatusBadge status={row.status} className="shrink-0" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Term</div>
                  <div className="mt-0.5 text-foreground">
                    {formatDate(row.start_date)} → {formatDate(row.end_date)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Annual rent</div>
                  <div className="mt-0.5 font-medium text-foreground">{formatAed(Number(row.annual_rent))}</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
