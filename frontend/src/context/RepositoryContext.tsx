import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRepositoriesQuery } from '@/hooks/useApi'
import { Repository } from '@/services/api'

interface RepositoryContextType {
  selectedRepo: Repository | null
  selectedRepoId: string
  setSelectedRepoId: (id: string | number) => void
  repositories: Repository[]
  isLoading: boolean
  error: any
  refetchRepositories: () => Promise<any>
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined)

const STORAGE_KEY = 'syncops_selected_repo_id'

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [authToken, setAuthToken] = useState<string>(() => {
    try {
      return localStorage.getItem('sycnops_token') || ''
    } catch {
      return ''
    }
  })
  const prevTokenRef = useRef(authToken)

  const { data: repositories = [], isLoading, error, refetch } = useRepositoriesQuery(Boolean(authToken))

  // Read initial repo ID from localStorage
  const [selectedRepoId, setSelectedRepoIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })

  // Find the selected repository object
  const selectedRepo = useMemo(() => {
    if (!repositories || repositories.length === 0) return null
    if (!selectedRepoId) return repositories[0]

    const found = repositories.find(
      (r) =>
        String(r.id) === String(selectedRepoId) ||
        r.name === selectedRepoId ||
        r.fullName === selectedRepoId
    )
    return found || repositories[0]
  }, [repositories, selectedRepoId])

  // Keep state and localStorage in sync
  const setSelectedRepoId = useCallback((id: string | number) => {
    const stringId = String(id || '')
    setSelectedRepoIdState(stringId)
    try {
      if (stringId) {
        localStorage.setItem(STORAGE_KEY, stringId)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Ignore storage errors in sandboxed environments
    }
  }, [])

  // Reset cached repo data and selection when user logs in, logs out, or switches accounts
  useEffect(() => {
    const syncAuth = () => {
      let nextToken = ''
      try {
        nextToken = localStorage.getItem('sycnops_token') || ''
      } catch {}
      if (nextToken !== prevTokenRef.current) {
        prevTokenRef.current = nextToken
        setAuthToken(nextToken)
        setSelectedRepoId('')
        queryClient.clear()
        if (nextToken) {
          queryClient.invalidateQueries({ queryKey: ['repositories'] })
        }
      }
    }
    window.addEventListener('sycnops_user_updated', syncAuth)
    window.addEventListener('storage', syncAuth)
    return () => {
      window.removeEventListener('sycnops_user_updated', syncAuth)
      window.removeEventListener('storage', syncAuth)
    }
  }, [queryClient, setSelectedRepoId])

  // Auto-select first real repo if none selected or if selected repo was deleted
  useEffect(() => {
    if (repositories.length > 0) {
      if (!selectedRepoId) {
        setSelectedRepoId(repositories[0].id)
      } else {
        const exists = repositories.some(
          (r) =>
            String(r.id) === String(selectedRepoId) ||
            r.name === selectedRepoId ||
            r.fullName === selectedRepoId
        )
        if (!exists) {
          setSelectedRepoId(repositories[0].id)
        }
      }
    } else if (selectedRepoId) {
      setSelectedRepoId('')
    }
  }, [repositories, selectedRepoId, setSelectedRepoId])

  // Sync with ?repoId= or ?repo= URL search param if present on initial navigation
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const urlRepo = params.get('repoId') || params.get('repo')
      if (urlRepo && repositories.length > 0) {
        const found = repositories.find(
          (r) =>
            String(r.id) === String(urlRepo) ||
            r.name === urlRepo ||
            r.fullName === urlRepo
        )
        if (found) {
          setSelectedRepoId(found.id)
        }
      }
    } catch {}
  }, [repositories, setSelectedRepoId])

  const contextValue = useMemo(
    () => ({
      selectedRepo,
      selectedRepoId: selectedRepo ? String(selectedRepo.id) : '',
      setSelectedRepoId,
      repositories,
      isLoading,
      error,
      refetchRepositories: refetch
    }),
    [selectedRepo, setSelectedRepoId, repositories, isLoading, error, refetch]
  )

  return (
    <RepositoryContext.Provider value={contextValue}>
      {children}
    </RepositoryContext.Provider>
  )
}

export function useRepositoryContext() {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error('useRepositoryContext must be used within a RepositoryProvider')
  }
  return context
}
