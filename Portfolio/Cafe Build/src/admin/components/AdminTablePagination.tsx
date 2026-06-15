import { ChevronLeft, ChevronRight } from 'lucide-react'
import { adminBtnGhost } from '../adminClassNames'

interface AdminTablePaginationProps {
  page: number
  totalPages: number
  totalRows: number
  pageSize: number
  hasPrev: boolean
  hasNext: boolean
  onPageChange: (page: number) => void
}

export function AdminTablePagination({
  page,
  totalPages,
  totalRows,
  pageSize,
  hasPrev,
  hasNext,
  onPageChange,
}: AdminTablePaginationProps) {
  if (totalRows <= pageSize) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalRows)

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--admin-text-muted)]">
        Showing {start}–{end} of {totalRows}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={adminBtnGhost}
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span className="px-2 text-sm text-[var(--admin-text-muted)]">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={adminBtnGhost}
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
