import { useQuery, useMutation } from '@tanstack/react-query'
import {
  fetchRepositories,
  fetchPullRequests,
  fetchIssues,
  fetchAnalytics,
  sendAiPrompt
} from '@/services/api'

export function useRepositoriesQuery() {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: fetchRepositories
  })
}

export function usePullRequestsQuery() {
  return useQuery({
    queryKey: ['pull-requests'],
    queryFn: fetchPullRequests
  })
}

export function useIssuesQuery() {
  return useQuery({
    queryKey: ['issues'],
    queryFn: fetchIssues
  })
}

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics
  })
}

export function useAiAssistantMutation() {
  return useMutation({
    mutationFn: (message: string) => sendAiPrompt(message)
  })
}
