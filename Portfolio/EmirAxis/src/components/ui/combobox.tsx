import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  keywords?: string[];
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps {
  options?: ComboboxOption[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
  /** Remote search: called whenever query changes. Should return options. */
  onSearch?: (query: string) => Promise<ComboboxOption[]> | ComboboxOption[];
  /** When using onSearch, an initial fetch happens on open with empty query. */
  asyncDebounceMs?: number;
  renderOption?: (option: ComboboxOption) => React.ReactNode;
  renderTrigger?: (option: ComboboxOption | null) => React.ReactNode;
}

/**
 * Premium command-palette style searchable select.
 * Works with static options or remote search via `onSearch`.
 */
export function Combobox({
  options: staticOptions,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results",
  loading: loadingProp,
  clearable = true,
  disabled,
  className,
  align = "start",
  onSearch,
  asyncDebounceMs = 200,
  renderOption,
  renderTrigger,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [asyncOpts, setAsyncOpts] = React.useState<ComboboxOption[]>([]);
  const [asyncLoading, setAsyncLoading] = React.useState(false);
  const [selectedCache, setSelectedCache] = React.useState<ComboboxOption | null>(null);

  // Remote search effect
  React.useEffect(() => {
    if (!onSearch || !open) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setAsyncLoading(true);
      try {
        const res = await onSearch(query);
        if (!cancelled) setAsyncOpts(res);
      } finally {
        if (!cancelled) setAsyncLoading(false);
      }
    }, asyncDebounceMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open, onSearch, asyncDebounceMs]);

  const options = onSearch ? asyncOpts : staticOptions ?? [];
  const loading = loadingProp || asyncLoading;

  const selected =
    options.find((o) => o.value === value) ??
    (selectedCache && selectedCache.value === value ? selectedCache : null);

  const handleSelect = (opt: ComboboxOption) => {
    onChange?.(opt.value === value ? null : opt.value);
    setSelectedCache(opt);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setSelectedCache(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
            {renderTrigger ? renderTrigger(selected) : selected ? (
              <>
                {selected.icon}
                <span className="truncate">{selected.label}</span>
              </>
            ) : (
              placeholder
            )}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {clearable && selected && !disabled && (
              <span
                role="button"
                aria-label="Clear"
                onClick={handleClear}
                className="rounded-sm p-0.5 opacity-60 hover:bg-accent hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-[--radix-popover-trigger-width] min-w-[260px] p-0"
      >
        <Command shouldFilter={!onSearch}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-72">
            {loading && (
              <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Loading…
              </div>
            )}
            {!loading && options.length === 0 && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            {!loading && options.length > 0 && (
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={[opt.label, opt.value, ...(opt.keywords ?? [])].join(" ")}
                    disabled={opt.disabled}
                    onSelect={() => handleSelect(opt)}
                    className="flex items-start gap-2"
                  >
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4",
                        value === opt.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {renderOption ? renderOption(opt) : (
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 truncate text-sm">
                            {opt.icon}
                            <span className="truncate">{opt.label}</span>
                          </div>
                          {opt.description && (
                            <div className="truncate text-xs text-muted-foreground">
                              {opt.description}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
