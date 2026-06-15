import { useMemo, useState } from 'react'

const PAGE_SIZE = 20

export function useAdminTablePagination<T>(rows: T[]) {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

  const safePage = Math.min(page, pageCount - 1)

  const slice = useMemo(() => {
    const start = safePage * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [rows, safePage])

  return {
    page: safePage,
    pageCount,
    pageSize: PAGE_SIZE,
    slice,
    setPage,
    next: () => setPage((p) => Math.min(p + 1, pageCount - 1)),
    prev: () => setPage((p) => Math.max(p - 1, 0)),
    total: rows.length,
  }
}
