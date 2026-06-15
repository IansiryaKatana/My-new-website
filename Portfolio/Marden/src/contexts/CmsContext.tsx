import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadCmsSnapshot } from '#/lib/cms/loadCmsSnapshot'
import type { CmsSnapshot } from '#/lib/cms/types'

type CmsContextValue = {
  snapshot: CmsSnapshot | null
  loading: boolean
  mode: 'static' | 'live'
  cmsEmpty: boolean
  refetch: () => Promise<void>
}

const CmsContext = createContext<CmsContextValue | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<CmsSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'static' | 'live'>('static')
  const [cmsEmpty, setCmsEmpty] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await loadCmsSnapshot()
    setSnapshot(result.snapshot)
    setMode(result.mode)
    setCmsEmpty(result.cmsEmpty)
    setLoading(false)
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const value = useMemo(
    () => ({ snapshot, loading, mode, cmsEmpty, refetch }),
    [snapshot, loading, mode, cmsEmpty, refetch],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
