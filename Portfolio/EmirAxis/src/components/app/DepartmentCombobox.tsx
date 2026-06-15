import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Combobox } from "@/components/ui/combobox";

const DEFAULTS = [
  "Operations", "Engineering", "Construction", "Hospitality", "Facilities Management",
  "Cleaning", "Security", "Logistics", "Warehouse", "Retail", "Healthcare",
  "Administration", "Finance", "Human Resources", "Sales", "Marketing", "IT",
  "Customer Service", "Drivers & Transport", "Catering",
];

interface Props {
  value?: string | null;
  onChange?: (v: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function DepartmentCombobox({ value, onChange, placeholder = "Select department…", className }: Props) {
  const { data: existing } = useQuery({
    queryKey: ["departments-distinct"],
    queryFn: async () => {
      const { data } = await supabase.from("workers").select("department").not("department", "is", null).limit(1000);
      return Array.from(new Set((data ?? []).map((d) => d.department).filter(Boolean) as string[]));
    },
    staleTime: 60_000,
  });

  const merged = Array.from(new Set([...(existing ?? []), ...DEFAULTS])).sort();

  return (
    <Combobox
      options={merged.map((d) => ({ value: d, label: d }))}
      value={value ?? undefined}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search or pick a department…"
      className={className}
    />
  );
}
