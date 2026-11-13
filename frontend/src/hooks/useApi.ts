import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRepositories,
  fetchPullRequests,
  fetchIssues,
  fetchAnalytics,
  importRepository,
  deleteRepository,
  fetchPipelines,
  triggerPipelineRun,
  cancelPipelineRun,
  fetchRepoAnalysisPipeline,
  runRepoAnalysisPipeline,
  fetchCodeFlowOperations,
  fetchCodeFlowTrace,
  analyzeFileAST,
  scanFileFlow,
  fetchFileFlowGraph,
  fetchFileFlowFiles,
  fetchFileDetails,
  fetchFileFlowPaths
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

export function usePipelinesQuery(filters?: { status?: string; repo?: string }) {
  return useQuery({
    queryKey: ['pipelines', filters?.status, filters?.repo],
    queryFn: () => fetchPipelines(filters),
    refetchInterval: 5000 // Poll every 5s for live updates on running pipelines
  })
}

export function useTriggerPipelineMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: triggerPipelineRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
    }
  })
}

export function useCancelPipelineMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelPipelineRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
    }
  })
}

export function useRepoAnalysisPipelineQuery(repoId?: string | number) {
  return useQuery({
    queryKey: ['repo-analysis-pipeline', repoId],
    queryFn: () => fetchRepoAnalysisPipeline(repoId),
    staleTime: 60000
  })
}

export function useRunRepoAnalysisPipelineMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (repoId?: string | number) => runRepoAnalysisPipeline(repoId),
    onSuccess: (_, repoId) => {
      queryClient.invalidateQueries({ queryKey: ['repo-analysis-pipeline', repoId] })
      queryClient.invalidateQueries({ queryKey: ['repo-analysis-pipeline'] })
    }
  })
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
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
      queryClient.invalidateQueries({ queryKey: ['repo-analysis-pipeline'] })
    }
  })
}

export function useDeleteRepositoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deleteRepository(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
      queryClient.invalidateQueries({ queryKey: ['pull-requests'] })
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['pipelines'] })
      queryClient.invalidateQueries({ queryKey: ['repo-analysis-pipeline'] })
    }
  })
}

export function useCodeFlowOperationsQuery() {
  return useQuery({
    queryKey: ['code-flow-operations'],
    queryFn: fetchCodeFlowOperations
  })
}

export function useCodeFlowTraceQuery(operationId: string) {
  return useQuery({
    queryKey: ['code-flow-trace', operationId],
    queryFn: () => fetchCodeFlowTrace(operationId),
    enabled: Boolean(operationId)
  })
}

export function useAnalyzeFileASTMutation() {
  return useMutation({
    mutationFn: (data: { code?: string; filePath?: string }) => analyzeFileAST(data.code, data.filePath)
  })
}

// ── File Flow Architecture Hooks ──────────────────────────────

export function useFileFlowGraphQuery(projectId = 'sycnops') {
  return useQuery({
    queryKey: ['file-flow-graph', projectId],
    queryFn: () => fetchFileFlowGraph(projectId),
    staleTime: 60000
  })
}

export function useFileFlowFilesQuery(projectId = 'sycnops') {
  return useQuery({
    queryKey: ['file-flow-files', projectId],
    queryFn: () => fetchFileFlowFiles(projectId)
  })
}

export function useFileDetailsQuery(filePath: string | null) {
  return useQuery({
    queryKey: ['file-flow-details', filePath],
    queryFn: () => (filePath ? fetchFileDetails(filePath) : null),
    enabled: Boolean(filePath)
  })
}

export function useScanFileFlowMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (projectId?: string) => scanFileFlow(projectId || 'sycnops'),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['file-flow-graph', projectId || 'sycnops'] })
      queryClient.invalidateQueries({ queryKey: ['file-flow-files', projectId || 'sycnops'] })
    }
  })
}

export function useFileFlowPathsQuery(source: string | null, target: string | null, projectId = 'sycnops') {
  return useQuery({
    queryKey: ['file-flow-paths', source, target, projectId],
    queryFn: () => (source && target ? fetchFileFlowPaths(source, target, projectId) : []),
    enabled: Boolean(source && target)
  })
}



