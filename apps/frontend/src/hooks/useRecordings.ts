import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Recording {
  id: string;
  meetingId: string;
  url: string;
  duration: number;
  fileSize: number;
  transcript?: string;
  status: string;
  createdAt: string;
}

export function useRecordings(params?: { meetingId?: string }) {
  return useQuery({
    queryKey: ['recordings', params],
    queryFn: async () => {
      const { data } = await api.get('/recordings', { params });
      return data.recordings as Recording[];
    },
  });
}

export function useRecording(id: string) {
  return useQuery({
    queryKey: ['recording', id],
    queryFn: async () => {
      const { data } = await api.get(`/recordings/${id}`);
      return data.recording as Recording;
    },
    enabled: !!id,
  });
}

export function useDeleteRecording() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recordings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
    },
  });
}

export function useDownloadRecording() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/recordings/${id}/download`);
      return data.url as string;
    },
  });
}
