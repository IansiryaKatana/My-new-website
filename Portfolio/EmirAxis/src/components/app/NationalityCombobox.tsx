import { Combobox } from "@/components/ui/combobox";
import { NATIONALITIES } from "@/lib/data/nationalities";

interface Props {
  value?: string | null;
  onChange?: (v: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function NationalityCombobox({ value, onChange, placeholder = "Select nationality…", className, disabled }: Props) {
  return (
    <Combobox
      options={NATIONALITIES.map((n) => ({ value: n.demonym, label: `${n.flag} ${n.demonym}`, keywords: [n.country, n.code] }))}
      value={value ?? undefined}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search nationality…"
      className={className}
      disabled={disabled}
    />
  );
}
