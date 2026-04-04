'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Venture, Document, Update } from '../types'

export interface PortalContextType {
  // Portal state
  selectedVenture: Venture | null
  setSelectedVenture: (venture: Venture | null) => void

  // Document filtering
  documentFilter: {
    category?: string
    venture_id?: number
  }
  setDocumentFilter: (filter: Partial<PortalContextType['documentFilter']>) => void

  // Portal data cache
  ventures: Venture[]
  setVentures: (ventures: Venture[]) => void

  documents: Document[]
  setDocuments: (documents: Document[]) => void

  updates: Update[]
  setUpdates: (updates: Update[]) => void

  // UI state
  isLoadingPortal: boolean
  setIsLoadingPortal: (loading: boolean) => void
}

const PortalContext = createContext<PortalContextType | undefined>(undefined)

export function PortalProvider({ children }: { children: ReactNode }) {
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null)
  const [documentFilter, setDocumentFilterState] = useState<PortalContextType['documentFilter']>({
    category: undefined,
    venture_id: undefined,
  })
  const [ventures, setVentures] = useState<Venture[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)

  const setDocumentFilter = useCallback((filter: Partial<PortalContextType['documentFilter']>) => {
    setDocumentFilterState((prev) => ({ ...prev, ...filter }))
  }, [])

  return (
    <PortalContext.Provider
      value={{
        selectedVenture,
        setSelectedVenture,
        documentFilter,
        setDocumentFilter,
        ventures,
        setVentures,
        documents,
        setDocuments,
        updates,
        setUpdates,
        isLoadingPortal,
        setIsLoadingPortal,
      }}
    >
      {children}
    </PortalContext.Provider>
  )
}

export function usePortalContext() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortalContext must be used within a PortalProvider')
  }
  return context
}
