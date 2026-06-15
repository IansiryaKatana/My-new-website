import { useMemo, useState } from 'react'
import { Button, Card, CrudDialog, Input } from './ui'

type Column<T> = {
  key: keyof T
  label: string
}

export function EntityCrudPage<T extends Record<string, string | number | boolean>>({
  title,
  items,
  setItems,
  columns,
  template,
}: {
  title: string
  items: T[]
  setItems: (items: T[]) => void
  columns: Column<T>[]
  template: T
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<T>(template)

  const rows = useMemo(
    () =>
      items.filter((item) =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  )

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-xl font-semibold">{title}</h1>
        <Input placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
        <Button onClick={() => setOpen(true)}>New</Button>
      </div>
      <div className="overflow-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs text-[var(--muted)]">
            <tr>
              {columns.map((column) => (
                <th className="p-3" key={String(column.key)}>
                  {column.label}
                </th>
              ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={String(item.id)} className="border-t border-[var(--border)]">
                {columns.map((column) => (
                  <td className="p-3" key={String(column.key)}>
                    {String(item[column.key])}
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="text-xs text-indigo-700" onClick={() => (setDraft(item), setOpen(true))}>
                      Edit
                    </button>
                    <button className="text-xs text-red-600" onClick={() => setItems(items.filter((row) => row.id !== item.id))}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CrudDialog open={open} onOpenChange={setOpen} title={`${title} Form`}>
        <div className="space-y-3">
          {columns.map((column) => (
            <Input
              key={String(column.key)}
              value={String(draft[column.key] ?? '')}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  [column.key]:
                    typeof template[column.key] === 'number'
                      ? Number(e.target.value)
                      : typeof template[column.key] === 'boolean'
                        ? e.target.value === 'true'
                        : e.target.value,
                })
              }
              placeholder={column.label}
            />
          ))}
          <Button
            className="w-full"
            onClick={() => {
              const id = String(draft.id || `${Date.now()}`)
              setItems([{ ...draft, id } as T, ...items.filter((item) => item.id !== id)])
              setOpen(false)
              setDraft(template)
            }}
          >
            Save
          </Button>
        </div>
      </CrudDialog>
    </Card>
  )
}
