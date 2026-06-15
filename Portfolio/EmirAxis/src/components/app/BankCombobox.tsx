import * as React from "react";
import { Building2 } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { supabase } from "@/integrations/supabase/client";

interface BankComboboxProps {
  /** Stores the bank NAME (matches workers.bank_name text column). */
  value?: string | null;
  onChange?: (bankName: string | null, meta?: { swift?: string | null; routing?: string | null }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Searchable UAE bank picker backed by the `search_uae_banks` RPC.
 * Stores the bank name as the value (string) for compatibility with
 * existing `workers.bank_name` text column.
 */
export function BankCombobox({ value, onChange, placeholder = "Select bank…", className, disabled }: BankComboboxProps) {
  const cacheRef = React.useRef<Map<string, ComboboxOption>>(new Map());

  const handleSearch = React.useCallback(async (q: string) => {
    const { data, error } = await supabase.rpc("search_uae_banks", {
      _q: q ?? "",
      _active_only: true,
      _limit: 50,
    });
    if (error) {
      console.error("[BankCombobox] search failed", error);
      return [];
    }
    const rows = (data ?? []) as Array<{
      id: string;
      name: string;
      short_name: string | null;
      swift_code: string | null;
      routing_code: string | null;
      bank_code: string | null;
      emirate: string | null;
      logo_url: string | null;
    }>;
    const opts: ComboboxOption[] = rows.map((b) => {
      const desc = [b.short_name, b.swift_code, b.emirate].filter(Boolean).join(" · ");
      const opt: ComboboxOption = {
        value: b.name,
        label: b.name,
        description: desc || undefined,
        keywords: [b.short_name, b.swift_code, b.routing_code, b.bank_code].filter(Boolean) as string[],
        icon: <Building2 className="h-3.5 w-3.5 text-muted-foreground" />,
      };
      cacheRef.current.set(b.name, opt);
      return opt;
    });
    return opts;
  }, []);

  return (
    <Combobox
      value={value ?? null}
      onChange={(v) => {
        const opt = v ? cacheRef.current.get(v) : null;
        onChange?.(v, opt ? { swift: (opt.keywords?.[1] ?? null), routing: (opt.keywords?.[2] ?? null) } : undefined);
      }}
      onSearch={handleSearch}
      placeholder={placeholder}
      searchPlaceholder="Search UAE banks…"
      emptyText="No banks match"
      className={className}
      disabled={disabled}
    />
  );
}
