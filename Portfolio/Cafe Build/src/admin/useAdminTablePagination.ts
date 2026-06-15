import { useMemo, useState } from 'react'

const DEFAULT_PAGE_SIZE = 20

export function useAdminTablePagination<T>(rows: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

  const safePage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, safePage, pageSize])

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages))
  }

  const resetPage = () => setPage(1)

  return {
    page: safePage,
    pageSize,
    totalPages,
    totalRows: rows.length,
    pageRows,
    goToPage,
    resetPage,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  }
}
