import * as React from "react";
import { UserCircle2 } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "manager" | "recruiter" | "accountant" | "worker" | "client";

interface StaffComboboxProps {
  value?: string | null;
  onChange?: (userId: string | null) => void;
  /** Restrict results to staff who have this role. */
  role?: AppRole;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  activeOnly?: boolean;
}

/**
 * Searchable staff selector — backed by `search_staff` RPC.
 * Shows avatar, name, role chips, and email/job title.
 */
export function StaffCombobox({
  value,
  onChange,
  role,
  placeholder = "Select staff member…",
  className,
  disabled,
  activeOnly = true,
}: StaffComboboxProps) {
  const handleSearch = React.useCallback(async (q: string) => {
    const args: { _q: string; _active_only: boolean; _limit: number; _role?: AppRole } = {
      _q: q ?? "",
      _active_only: activeOnly,
      _limit: 50,
    };
    if (role) args._role = role;
    const { data, error } = await supabase.rpc("search_staff", args);
    if (error) {
      console.error("[StaffCombobox] search failed", error);
      return [];
    }
    const rows = (data ?? []) as Array<{
      id: string;
      full_name: string | null;
      email: string | null;
      phone: string | null;
      avatar_url: string | null;
      job_title: string | null;
      is_active: boolean;
      roles: string[] | null;
    }>;
    return rows.map<ComboboxOption>((p) => {
      const name = p.full_name ?? p.email ?? "Unnamed";
      const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
      const roleLabels = (p.roles ?? []).slice(0, 3);
      return {
        value: p.id,
        label: name,
        description: [p.job_title, p.email].filter(Boolean).join(" · ") || undefined,
        keywords: [p.email, p.phone, ...(p.roles ?? [])].filter(Boolean) as string[],
        icon: (
          <Avatar className="h-5 w-5">
            {p.avatar_url ? <AvatarImage src={p.avatar_url} alt={name} /> : null}
            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">
              {initials || <UserCircle2 className="h-3 w-3" />}
            </AvatarFallback>
          </Avatar>
        ),
        // Custom-rendered below — but keep label for filtering & selected display
        keywordsExtras: roleLabels,
      } as ComboboxOption & { keywordsExtras?: string[] };
    });
  }, [role, activeOnly]);

  return (
    <Combobox
      value={value ?? null}
      onChange={(v) => onChange?.(v)}
      onSearch={handleSearch}
      placeholder={placeholder}
      searchPlaceholder="Search by name, email, phone…"
      emptyText="No staff match"
      className={className}
      disabled={disabled}
      renderOption={(opt) => {
        const extras = (opt as ComboboxOption & { keywordsExtras?: string[] }).keywordsExtras ?? [];
        return (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {opt.icon}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 truncate text-sm">
                <span className="truncate">{opt.label}</span>
                {extras.slice(0, 2).map((r) => (
                  <Badge key={r} variant="secondary" className="h-4 px-1.5 text-[9px] uppercase tracking-wider">
                    {r}
                  </Badge>
                ))}
              </div>
              {opt.description && (
                <div className="truncate text-xs text-muted-foreground">{opt.description}</div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
