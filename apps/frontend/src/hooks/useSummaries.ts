import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Summary {
  id: string;
  meetingId: string;
  executiveSummary?: string;
  detailedSummary?: string;
  actionItems?: string;
  keyDecisions?: string;
  risks?: string;
  questions?: string;
  followUpTasks?: string;
  whoSaidWhat?: string;
  status: string;
  generatedAt?: string;
}

export function useSummaries(params?: { meetingId?: string }) {
  return useQuery({
    queryKey: ['summaries', params],
    queryFn: async () => {
      const { data } = await api.get('/summaries', { params });
      return data.summaries as Summary[];
    },
  });
}

export function useSummary(id: string) {
  return useQuery({
    queryKey: ['summary', id],
    queryFn: async () => {
      const { data } = await api.get(`/summaries/${id}`);
      return data.summary as Summary;
    },
    enabled: !!id,
  });
}

export function useGenerateSummary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ meetingId, type }: { meetingId: string; type: string }) => {
      const { data } = await api.post('/summaries/generate', { meetingId, type });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['summaries', { meetingId: variables.meetingId }] });
    },
  });
}

export function useUpdateSummary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...summary }: Partial<Summary> & { id: string }) => {
      const { data } = await api.put(`/summaries/${id}`, summary);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['summary', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['summaries'] });
    },
  });
}
