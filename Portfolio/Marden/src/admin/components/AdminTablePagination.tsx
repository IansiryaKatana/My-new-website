import { Button } from '#/components/ui/button'

type Props = {
  page: number
  pageCount: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function AdminTablePagination({ page, pageCount, total, onPrev, onNext }: Props) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-[var(--admin-muted)]">
      <span>
        Page {page + 1} of {pageCount} · {total} rows
      </span>
      <div className="flex gap-2">
        <Button variant="adminGhost" size="sm" type="button" onClick={onPrev} disabled={page === 0}>
          Previous
        </Button>
        <Button
          variant="adminGhost"
          size="sm"
          type="button"
          onClick={onNext}
          disabled={page >= pageCount - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
