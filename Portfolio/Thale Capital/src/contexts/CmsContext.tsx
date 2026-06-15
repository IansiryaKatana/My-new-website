import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadCmsSnapshot } from '../lib/cms/loadCmsSnapshot'
import { fallbackSnapshot, type CmsSnapshot } from '../lib/cms/types'

type CmsContextValue = {
  snapshot: CmsSnapshot
  loading: boolean
  refetch: () => Promise<void>
  setSnapshot: React.Dispatch<React.SetStateAction<CmsSnapshot>>
}

const CmsContext = createContext<CmsContextValue | null>(null)

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<CmsSnapshot>(fallbackSnapshot)
  const [loading, setLoading] = useState(true)

  const refetch = async () => {
    setLoading(true)
    const next = await loadCmsSnapshot()
    setSnapshot(next)
    setLoading(false)
  }

  useEffect(() => {
    void refetch()
  }, [])

  const value = useMemo(
    () => ({ snapshot, loading, refetch, setSnapshot }),
    [snapshot, loading],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used in CmsProvider')
  return ctx
}
