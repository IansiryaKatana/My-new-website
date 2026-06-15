import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fallbackCms } from '#/data/fallback-cms'
import { getSupabase } from '#/integrations/supabase/client'
import { loadCmsSnapshot } from '#/lib/cms/loadCmsSnapshot'
import type { CmsSnapshot } from '#/lib/cms/types'

type CmsContextValue = {
  snapshot: CmsSnapshot
  mode: 'static' | 'live'
  cmsEmpty: boolean
  loading: boolean
  refetch: () => Promise<void>
}

const CmsContext = createContext<CmsContextValue | null>(null)

export function CmsProvider({
  children,
  skipFetch = false,
}: {
  children: ReactNode
  skipFetch?: boolean
}) {
  const [snapshot, setSnapshot] = useState<CmsSnapshot>(fallbackCms)
  const [mode, setMode] = useState<'static' | 'live'>('static')
  const [cmsEmpty, setCmsEmpty] = useState(false)
  const [loading, setLoading] = useState(!skipFetch)

  const refetch = useCallback(async () => {
    if (skipFetch) return
    setLoading(true)
    const result = await loadCmsSnapshot(getSupabase())
    setSnapshot(result.snapshot)
    setMode(result.mode)
    setCmsEmpty(result.cmsEmpty)
    setLoading(false)
  }, [skipFetch])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const value = useMemo(
    () => ({ snapshot, mode, cmsEmpty, loading, refetch }),
    [snapshot, mode, cmsEmpty, loading, refetch],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
