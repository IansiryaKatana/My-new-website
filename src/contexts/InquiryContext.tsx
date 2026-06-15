import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import type { InquiryOpenOptions } from '../lib/inquiry/types'

type InquiryState = {
  open: boolean
  options: InquiryOpenOptions
}

type InquiryContextValue = {
  open: boolean
  options: InquiryOpenOptions
  openInquiry: (options?: InquiryOpenOptions) => void
  closeInquiry: () => void
}

const InquiryContext = createContext<InquiryContextValue | null>(null)

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InquiryState>({ open: false, options: {} })

  const openInquiry = useCallback((options: InquiryOpenOptions = {}) => {
    setState({ open: true, options })
  }, [])

  const closeInquiry = useCallback(() => {
    setState((current) => ({ ...current, open: false }))
  }, [])

  const value = useMemo(
    () => ({
      open: state.open,
      options: state.options,
      openInquiry,
      closeInquiry,
    }),
    [state, openInquiry, closeInquiry],
  )

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
}

export function useInquiry() {
  const ctx = useContext(InquiryContext)
  if (!ctx) {
    throw new Error('useInquiry must be used within InquiryProvider')
  }
  return ctx
}
