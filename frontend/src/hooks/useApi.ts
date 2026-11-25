import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  fetchRepositories,
  fetchDashboard,
  fetchPullRequests,
  fetchIssues,
  fetchAnalytics,

  importRepository,

  deleteRepository,

  deleteAllRepositories,

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

  fetchFileFlowPaths,

  fetchTopology,

  fetchTopologyTree,

  fetchTopologyDependencies,

  fetchTopologyFile,

  rescanTopology,

  fetchCodeQualityLatest,

  fetchCodeQualityStatus,

  triggerCodeQualityScan,

  fetchCodeQualityHistory,

  fetchCodeQualityScanDetails,

  fetchAIProviderStatus,

  fetchAIExplanation,

  generateAIExplanation,
  fetchAIFix,
  generateAIFix,
  applyAIFix,
  rollbackAIFix,
  rejectAIFix

} from '@/services/api'



export function useRepositoriesQuery(enabled?: boolean) {
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('sycnops_token'))
  return useQuery({
    queryKey: ['repositories'],
    queryFn: fetchRepositories,
    enabled: enabled !== undefined ? enabled : hasToken
  })
}



export function useDashboardQuery(repoId?: string | number) {
  return useQuery({
    queryKey: ['dashboard', repoId],
    queryFn: () => fetchDashboard(repoId)
  })
}

export function usePullRequestsQuery(repoId?: string | number) {
  return useQuery({
    queryKey: ['pull-requests', repoId],
    queryFn: () => fetchPullRequests(repoId)
  })
}

export function useIssuesQuery(repoId?: string | number) {
  return useQuery({
    queryKey: ['issues', repoId],
    queryFn: () => fetchIssues(repoId)
  })
}

export function useAnalyticsQuery(repoId?: string | number) {
  return useQuery({
    queryKey: ['analytics', repoId],
    queryFn: () => fetchAnalytics(repoId)
  })
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

    onSuccess: (_data, id) => {

      queryClient.setQueryData(['repositories'], (old: any) =>

        Array.isArray(old) ? old.filter((r: any) => String(r.id) !== String(id) && r.name !== String(id) && r.fullName !== String(id)) : []

      )

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



export function useDeleteAllRepositoriesMutation() {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: deleteAllRepositories,

    onSuccess: () => {

      queryClient.setQueryData(['repositories'], [])

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



export function useCodeFlowOperationsQuery(repoId?: string | number) {
  return useQuery({
    queryKey: ['code-flow-operations', repoId],
    queryFn: () => fetchCodeFlowOperations(repoId),
    enabled: Boolean(repoId)
  })
}

export function useCodeFlowTraceQuery(operationId: string, repoId?: string | number) {
  return useQuery({
    queryKey: ['code-flow-trace', operationId, repoId],
    queryFn: () => fetchCodeFlowTrace(operationId, repoId),
    enabled: Boolean(operationId && repoId)
  })
}



export function useAnalyzeFileASTMutation() {

  return useMutation({

    mutationFn: (data: { code?: string; filePath?: string }) => analyzeFileAST(data.code, data.filePath)

  })

}



// ── File Flow Architecture Hooks ──────────────────────────────



export function useFileFlowGraphQuery(projectId = '') {

  return useQuery({

    queryKey: ['file-flow-graph', projectId],

    queryFn: () => fetchFileFlowGraph(projectId),

    enabled: Boolean(projectId),

    staleTime: 60000

  })

}



export function useFileFlowFilesQuery(projectId = '') {

  return useQuery({

    queryKey: ['file-flow-files', projectId],

    queryFn: () => fetchFileFlowFiles(projectId),

    enabled: Boolean(projectId)

  })

}



export function useFileDetailsQuery(filePath: string | null, projectId?: string) {

  return useQuery({

    queryKey: ['file-flow-details', projectId, filePath],

    queryFn: () => (filePath ? fetchFileDetails(filePath, projectId) : null),

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



// ── File Topology React Query Hooks ──────────────────────────────────────────



export function useTopologyQuery(projectId = '') {

  return useQuery({

    queryKey: ['topology', projectId],

    queryFn: () => fetchTopology(projectId),

    enabled: Boolean(projectId),

    staleTime: 60000

  })

}



export function useTopologyTreeQuery(projectId = '') {

  return useQuery({

    queryKey: ['topology-tree', projectId],

    queryFn: () => fetchTopologyTree(projectId),

    enabled: Boolean(projectId),

    staleTime: 60000

  })

}



export function useTopologyDependenciesQuery(projectId = '') {

  return useQuery({

    queryKey: ['topology-dependencies', projectId],

    queryFn: () => fetchTopologyDependencies(projectId),

    enabled: Boolean(projectId),

    staleTime: 60000

  })

}



export function useTopologyFileQuery(projectId: string, fileId: string | null) {

  return useQuery({

    queryKey: ['topology-file', projectId, fileId],

    queryFn: () => (fileId ? fetchTopologyFile(projectId, fileId) : null),

    enabled: Boolean(fileId)

  })

}



export function useRescanTopologyMutation() {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: (projectId: string) => rescanTopology(projectId),

    onSuccess: (_, projectId) => {

      queryClient.invalidateQueries({ queryKey: ['topology', projectId] })

      queryClient.invalidateQueries({ queryKey: ['topology-tree', projectId] })

      queryClient.invalidateQueries({ queryKey: ['topology-dependencies', projectId] })

    }

  })

}



// ── Code Quality React Query Hooks (Stage 2B / Stage 3) ─────────────────────



export function useCodeQualityLatestQuery(repoId?: string | number) {

  return useQuery({

    queryKey: ['code-quality-latest', String(repoId || '')],

    queryFn: () => (repoId ? fetchCodeQualityLatest(repoId) : null),

    enabled: Boolean(repoId)

  })

}



export function useCodeQualityStatusQuery(

  repoId?: string | number,

  scanId?: string,

  isScanning?: boolean

) {

  return useQuery({

    queryKey: ['code-quality-status', String(repoId || ''), scanId],

    queryFn: () => (repoId ? fetchCodeQualityStatus(repoId, scanId) : null),

    enabled: Boolean(repoId),

    refetchInterval: isScanning ? 2000 : false

  })

}



export function useCodeQualityHistoryQuery(

  repoId?: string | number,

  page = 1,

  limit = 10

) {

  return useQuery({

    queryKey: ['code-quality-history', String(repoId || ''), page, limit],

    queryFn: () => (repoId ? fetchCodeQualityHistory(repoId, page, limit) : null),

    enabled: Boolean(repoId)

  })

}



export function useCodeQualityScanDetailsQuery(

  repoId?: string | number,

  scanId?: string

) {

  return useQuery({

    queryKey: ['code-quality-scan-details', String(repoId || ''), scanId],

    queryFn: () => (repoId && scanId ? fetchCodeQualityScanDetails(repoId, scanId) : null),

    enabled: Boolean(repoId && scanId)

  })

}



export function useTriggerCodeQualityScanMutation() {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: ({ repoId, sync }: { repoId: string | number; sync?: boolean }) =>

      triggerCodeQualityScan(repoId, sync),

    onSuccess: (_, variables) => {

      const idStr = String(variables.repoId)

      queryClient.invalidateQueries({ queryKey: ['code-quality-latest', idStr] })

      queryClient.invalidateQueries({ queryKey: ['code-quality-history', idStr] })

      queryClient.invalidateQueries({ queryKey: ['code-quality-status', idStr] })

    }

  })

}



// ── Stage 4: AI Code Quality Intelligence Hooks ─────────────────────────────



export function useAIProviderStatusQuery(repoId?: string | number) {

  return useQuery({

    queryKey: ['ai-provider-status', String(repoId || '')],

    queryFn: () => (repoId ? fetchAIProviderStatus(repoId) : null),

    enabled: Boolean(repoId),

    staleTime: 60000

  })

}



export function useAIExplanationQuery(

  repoId?: string | number,

  findingId?: string,

  scanId?: string,

  enabled = true

) {

  return useQuery({

    queryKey: ['ai-explanation', String(repoId || ''), findingId, scanId],

    queryFn: () => (repoId && findingId ? fetchAIExplanation(repoId, findingId, scanId) : null),

    enabled: Boolean(repoId && findingId && enabled),

    retry: false

  })

}



export function useGenerateAIExplanationMutation() {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: ({

      repoId,

      findingId,

      scanId,

      regenerate

    }: {

      repoId: string | number

      findingId: string

      scanId?: string

      regenerate?: boolean

    }) => generateAIExplanation(repoId, findingId, { scanId, regenerate }),

    onSuccess: (result, variables) => {

      const repoKey = String(variables.repoId)

      queryClient.setQueryData(

        ['ai-explanation', repoKey, variables.findingId, variables.scanId],

        result.data

      )

    }

  })

}



// ── Stage 5: AI Fix Assistant Hooks ─────────────────────────────────────────

export function useAIFixQuery(
  repoId?: string | number,
  findingId?: string,
  scanId?: string,
  enabled = true
) {
  return useQuery({
    queryKey: ['ai-fix', String(repoId || ''), findingId, scanId],
    queryFn: () => (repoId && findingId ? fetchAIFix(repoId, findingId, scanId) : null),
    enabled: Boolean(repoId && findingId && enabled),
    retry: false
  })
}

export function useGenerateAIFixMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      repoId,
      findingId,
      scanId
    }: {
      repoId: string | number
      findingId: string
      scanId?: string
    }) => generateAIFix(repoId, findingId, { scanId }),
    onSuccess: (patch, variables) => {
      const repoKey = String(variables.repoId)
      queryClient.setQueryData(
        ['ai-fix', repoKey, variables.findingId, variables.scanId],
        patch
      )
    }
  })
}

export function useApplyAIFixMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      repoId,
      patchId,
      skipValidation
    }: {
      repoId: string | number
      patchId: string
      skipValidation?: boolean
    }) => applyAIFix(repoId, patchId, { confirmed: true, skipValidation }),
    onSuccess: (result, variables) => {
      const repoKey = String(variables.repoId)
      queryClient.invalidateQueries({ queryKey: ['ai-fix', repoKey] })
      queryClient.invalidateQueries({ queryKey: ['code-quality-latest', repoKey] })
    }
  })
}

export function useRollbackAIFixMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      repoId,
      patchId
    }: {
      repoId: string | number
      patchId: string
    }) => rollbackAIFix(repoId, patchId),
    onSuccess: (result, variables) => {
      const repoKey = String(variables.repoId)
      queryClient.invalidateQueries({ queryKey: ['ai-fix', repoKey] })
      queryClient.invalidateQueries({ queryKey: ['code-quality-latest', repoKey] })
    }
  })
}

export function useRejectAIFixMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      repoId,
      patchId
    }: {
      repoId: string | number
      patchId: string
    }) => rejectAIFix(repoId, patchId),
    onSuccess: (result, variables) => {
      const repoKey = String(variables.repoId)
      queryClient.invalidateQueries({ queryKey: ['ai-fix', repoKey] })
    }
  })
}
