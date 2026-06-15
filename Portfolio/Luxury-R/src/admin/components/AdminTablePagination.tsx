import { adminBtnGhost } from '../adminClassNames'

export function AdminTablePagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number
  totalPages: number
  total: number
  onPage: (p: number) => void
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[#8b897f]">
      <span>
        Page {page} of {totalPages} ({total} rows)
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className={adminBtnGhost}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className={adminBtnGhost}
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
