import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getSupabase, isSupabaseConfigured } from '../integrations/supabase/client'
import { loadCmsSnapshot } from '../lib/cms/loadCmsSnapshot'
import { getStaticCmsSnapshot } from '../lib/cms/staticSnapshot'
import type { CmsMode, CmsSnapshot } from '../lib/cms/types'

type CmsContextValue = {
  snapshot: CmsSnapshot
  mode: CmsMode
  loading: boolean
  cmsEmpty: boolean
  refetch: () => Promise<void>
}

const CmsContext = createContext<CmsContextValue | null>(null)

function isAdminPath() {
  if (typeof window === 'undefined') return false
  return window.location.pathname.startsWith('/admin')
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<CmsSnapshot>(getStaticCmsSnapshot)
  const [mode, setMode] = useState<CmsMode>('static')
  const [loading, setLoading] = useState(isSupabaseConfigured())

  const fetchSnapshot = useCallback(async () => {
    if (isAdminPath()) {
      setLoading(false)
      return
    }

    const sb = getSupabase()
    if (!sb) {
      setSnapshot(getStaticCmsSnapshot())
      setMode('static')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const next = await loadCmsSnapshot(sb)
      setSnapshot(next)
      setMode('live')
    } catch {
      setSnapshot(getStaticCmsSnapshot())
      setMode('static')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSnapshot()
  }, [fetchSnapshot])

  const value = useMemo(
    () => ({
      snapshot,
      mode,
      loading,
      cmsEmpty: snapshot.cmsEmpty,
      refetch: fetchSnapshot,
    }),
    [snapshot, mode, loading, fetchSnapshot],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) {
    throw new Error('useCms must be used within CmsProvider')
  }
  return ctx
}

export function useSiteConfig() {
  return useCms().snapshot.siteConfig
}

export function useHeroContent() {
  return useCms().snapshot.heroContent
}

export function useProjects() {
  return useCms().snapshot.projects
}

export function useExperience() {
  return useCms().snapshot.experience
}

export function useSkillGroups() {
  return useCms().snapshot.skillGroups
}

export function useEducation() {
  return useCms().snapshot.education
}

export function useCertifications() {
  return useCms().snapshot.certifications
}

