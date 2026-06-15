import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { loadCmsSnapshot } from '@/lib/cms/loadCmsSnapshot'
import { getStaticSnapshot } from '@/lib/cms/mappers'
import type { CmsSnapshot } from '@/lib/cms/types'

type CmsContextValue = {
  data: CmsSnapshot
  mode: 'static' | 'live'
  cmsEmpty: boolean
  loading: boolean
  refetch: () => Promise<void>
}

const CmsContext = createContext<CmsContextValue | null>(null)

export function CmsProvider({
  children,
  skipFetch,
}: {
  children: ReactNode
  skipFetch?: boolean
}) {
  const [data, setData] = useState<CmsSnapshot>(getStaticSnapshot)
  const [mode, setMode] = useState<'static' | 'live'>('static')
  const [cmsEmpty, setCmsEmpty] = useState(false)
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    const result = await loadCmsSnapshot()
    setData(result.snapshot)
    setMode(result.mode)
    setCmsEmpty(result.cmsEmpty)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!skipFetch) void refetch()
  }, [skipFetch, refetch])

  return (
    <CmsContext.Provider value={{ data, mode, cmsEmpty, loading, refetch }}>
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
