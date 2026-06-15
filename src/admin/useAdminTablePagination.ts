import { useMemo, useState } from 'react'

export function useAdminTablePagination<T>(rows: T[], pageSize = 20) {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))

  const safePage = Math.min(page, pageCount - 1)

  const slice = useMemo(() => {
    const start = safePage * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, safePage, pageSize])

  return {
    page: safePage,
    pageCount,
    slice,
    setPage,
    next: () => setPage((p) => Math.min(p + 1, pageCount - 1)),
    prev: () => setPage((p) => Math.max(p - 1, 0)),
    total: rows.length,
  }
}

