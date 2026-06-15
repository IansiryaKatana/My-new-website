import type { ReactNode } from 'react'

import { adminTab, adminTabActive } from '../adminClassNames'

export function AdminTabs({
  tabs,
  active,
  onChange,
  actions,
}: {
  tabs: Array<{ id: string; label: string }>
  active: string
  onChange: (id: string) => void
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--admin-border-subtle)]">
      <div className="flex gap-1" role="tablist" aria-label="Section tabs">
        {tabs.map((tab) => {
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`${adminTab} -mb-px ${selected ? adminTabActive : ''}`}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {actions ? (
        <div className="mb-2 flex flex-wrap items-center justify-end gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
