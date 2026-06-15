import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getSupabase, isSupabaseConfigured } from '#/integrations/supabase/client'
import {
  isCmsSnapshotEmpty,
  loadCmsSnapshot,
  resolveCmsSnapshot,
} from '#/lib/cms/loadCmsSnapshot'
import { getStaticCmsSnapshot } from '#/lib/cms/mappers'
import type {
  Benefit,
  CmsMode,
  CmsSections,
  CmsSnapshot,
  NavItem,
  Product,
  SiteBrand,
} from '#/lib/cms/types'

export interface CmsContextValue {
  snapshot: CmsSnapshot
  mode: CmsMode
  loading: boolean
  cmsEmpty: boolean
  refetch: () => Promise<void>
  brand: SiteBrand
  sections: CmsSections
  products: Product[]
  featuredProducts: Product[]
  benefits: Benefit[]
  navItems: NavItem[]
}

const CmsContext = createContext<CmsContextValue | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const skipFetch = pathname.startsWith('/admin')

  const [snapshot, setSnapshot] = useState<CmsSnapshot>(() => getStaticCmsSnapshot())
  const [mode, setMode] = useState<CmsMode>('static')
  const [loading, setLoading] = useState(false)
  const [cmsEmpty, setCmsEmpty] = useState(false)

  const refetch = useCallback(async () => {
    const supabase = getSupabase()
    if (!isSupabaseConfigured() || !supabase) {
      setSnapshot(getStaticCmsSnapshot())
      setMode('static')
      setCmsEmpty(false)
      return
    }

    setLoading(true)

    try {
      const liveSnapshot = await loadCmsSnapshot(supabase)
      const empty = isCmsSnapshotEmpty(liveSnapshot)
      setCmsEmpty(empty)
      setSnapshot(resolveCmsSnapshot(liveSnapshot))
      setMode(empty ? 'static' : 'live')
    } catch {
      setSnapshot(getStaticCmsSnapshot())
      setMode('static')
      setCmsEmpty(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (skipFetch) return
    void refetch()
  }, [refetch, skipFetch])

  const value = useMemo(
    (): CmsContextValue => ({
      snapshot,
      mode,
      loading,
      cmsEmpty,
      refetch,
      brand: snapshot.brand,
      sections: {
        hero: snapshot.hero,
        essence: snapshot.essence,
        promo: snapshot.promo,
        flavor: snapshot.flavor,
        footer: snapshot.footer,
      },
      products: snapshot.products,
      featuredProducts: snapshot.products.filter((product) => product.isFeatured),
      benefits: snapshot.benefits,
      navItems: snapshot.navItems,
    }),
    [snapshot, mode, loading, cmsEmpty, refetch],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms(): CmsContextValue {
  const context = useContext(CmsContext)
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider')
  }
  return context
}
