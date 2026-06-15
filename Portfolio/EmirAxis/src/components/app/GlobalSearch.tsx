import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Users, UserSearch, ClipboardList, Briefcase, FileCheck2 } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

interface Hit { id: string; label: string; sub?: string; kind: "client" | "worker" | "candidate" | "job_order" | "placement"; to: string; }

export function GlobalSearch({ open, onOpenChange }: Props) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const term = q.trim();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const like = `%${term}%`;
        const [clients, workers, cands, jobs] = await Promise.all([
          term ? supabase.from("clients").select("id, legal_name, trade_name").or(`legal_name.ilike.${like},trade_name.ilike.${like}`).limit(6)
               : supabase.from("clients").select("id, legal_name, trade_name").order("created_at", { ascending: false }).limit(5),
          term ? supabase.from("workers").select("id, full_name, employee_code, designation").or(`full_name.ilike.${like},employee_code.ilike.${like},passport_no.ilike.${like}`).limit(6)
               : supabase.from("workers").select("id, full_name, employee_code, designation").order("created_at", { ascending: false }).limit(5),
          term ? supabase.from("candidates").select("id, full_name, reference, email").or(`full_name.ilike.${like},reference.ilike.${like},email.ilike.${like}`).limit(6)
               : supabase.from("candidates").select("id, full_name, reference, email").order("created_at", { ascending: false }).limit(5),
          term ? supabase.from("job_orders").select("id, title, reference").or(`title.ilike.${like},reference.ilike.${like}`).limit(6)
               : supabase.from("job_orders").select("id, title, reference").order("created_at", { ascending: false }).limit(5),
        ]);
        if (cancelled) return;
        const out: Hit[] = [];
        for (const c of (clients.data ?? [])) out.push({ id: c.id, label: c.legal_name, sub: c.trade_name ?? "Client", kind: "client", to: "/clients" });
        for (const w of (workers.data ?? [])) out.push({ id: w.id, label: w.full_name, sub: `${w.employee_code ?? ""} · ${w.designation ?? "Worker"}`, kind: "worker", to: "/workers" });
        for (const c of (cands.data ?? [])) out.push({ id: c.id, label: c.full_name, sub: c.reference ?? c.email ?? "Candidate", kind: "candidate", to: "/candidates" });
        for (const j of (jobs.data ?? [])) out.push({ id: j.id, label: j.title, sub: j.reference ?? "Job order", kind: "job_order", to: "/job-orders" });
        setHits(out);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 180);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q, open]);

  const groups: Record<string, { label: string; icon: typeof Building2; items: Hit[] }> = {
    client: { label: "Clients", icon: Building2, items: hits.filter((h) => h.kind === "client") },
    worker: { label: "Workers", icon: Users, items: hits.filter((h) => h.kind === "worker") },
    candidate: { label: "Candidates", icon: UserSearch, items: hits.filter((h) => h.kind === "candidate") },
    job_order: { label: "Job orders", icon: ClipboardList, items: hits.filter((h) => h.kind === "job_order") },
  };

  const NAV = [
    { label: "Dashboard", to: "/dashboard", icon: Briefcase },
    { label: "Placements", to: "/placements", icon: Briefcase },
    { label: "Documents", to: "/documents", icon: FileCheck2 },
    { label: "Invoices", to: "/invoices", icon: Briefcase },
    { label: "Payslips", to: "/payslips", icon: Briefcase },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput value={q} onValueChange={setQ} placeholder="Search clients, workers, candidates, job orders…" />
      <CommandList>
        {loading && <div className="py-6 text-center text-xs text-muted-foreground">Searching…</div>}
        {!loading && hits.length === 0 && <CommandEmpty>No results</CommandEmpty>}
        {Object.entries(groups).map(([key, g]) =>
          g.items.length > 0 ? (
            <CommandGroup key={key} heading={g.label}>
              {g.items.map((h) => (
                <CommandItem key={`${key}-${h.id}`} value={`${h.label} ${h.sub ?? ""}`}
                  onSelect={() => { onOpenChange(false); navigate({ to: h.to }); }}>
                  <g.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{h.label}</span>
                    {h.sub && <span className="truncate text-xs text-muted-foreground">{h.sub}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null,
        )}
        <CommandSeparator />
        <CommandGroup heading="Jump to">
          {NAV.map((n) => (
            <CommandItem key={n.to} onSelect={() => { onOpenChange(false); navigate({ to: n.to }); }}>
              <n.icon className="mr-2 h-4 w-4 text-muted-foreground" /> {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
