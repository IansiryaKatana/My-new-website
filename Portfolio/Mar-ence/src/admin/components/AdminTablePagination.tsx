import { Button } from '#/components/ui/button'

type Props = {
  page: number
  pageCount: number
  total: number
  onPageChange: (page: number) => void
}

export function AdminTablePagination({
  page,
  pageCount,
  total,
  onPageChange,
}: Props) {
  if (total <= 0) return null

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <span>
        Page {page + 1} of {pageCount} ({total} rows)
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= pageCount - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
