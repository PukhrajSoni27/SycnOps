import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRepositories,
  fetchPullRequests,
  fetchIssues,
  fetchAnalytics,
  importRepository
} from '@/services/api'

export function useRepositoriesQuery() {
  return useQuery({ queryKey: ['repositories'], queryFn: fetchRepositories })
}

export function usePullRequestsQuery() {
  return useQuery({ queryKey: ['pull-requests'], queryFn: fetchPullRequests })
}

export function useIssuesQuery() {
  return useQuery({ queryKey: ['issues'], queryFn: fetchIssues })
}

export function useAnalyticsQuery() {
  return useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics })
}

export function useImportRepositoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: importRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
      queryClient.invalidateQueries({ queryKey: ['pull-requests'] })
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}
