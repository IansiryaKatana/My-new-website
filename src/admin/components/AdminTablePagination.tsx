import { adminBtn } from '../adminClassNames'

export function AdminTablePagination({
  page,
  pageCount,
  total,
  onPrev,
  onNext,
}: {
  page: number
  pageCount: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-sans text-sm text-[var(--admin-fg-muted)]">
      <span>
        Page {page + 1} of {pageCount} · {total} rows
      </span>
      <div className="flex gap-2">
        <button type="button" className={adminBtn} onClick={onPrev} disabled={page <= 0}>
          Previous
        </button>
        <button
          type="button"
          className={adminBtn}
          onClick={onNext}
          disabled={page >= pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

