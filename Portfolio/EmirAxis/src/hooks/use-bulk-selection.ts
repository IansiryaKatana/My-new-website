import { useCallback, useMemo, useState } from "react";

export function useBulkSelection<T extends { id: string }>(items: T[] | undefined) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allIds = useMemo(() => (items ?? []).map((i) => i.id), [items]);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0 && !allSelected;

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (allIds.every((id) => prev.has(id))) return new Set();
      return new Set(allIds);
    });
  }, [allIds]);

  const clear = useCallback(() => setSelected(new Set()), []);

  const selectedItems = useMemo(
    () => (items ?? []).filter((i) => selected.has(i.id)),
    [items, selected],
  );

  return {
    selected,
    selectedIds: Array.from(selected),
    selectedItems,
    count: selected.size,
    allSelected,
    someSelected,
    toggle,
    toggleAll,
    clear,
    isSelected: (id: string) => selected.has(id),
  };
}
