import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Participant {
  id: string;
  meetingId: string;
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  status: string;
  role: string;
}

export function useParticipants(meetingId?: string) {
  return useQuery({
    queryKey: ['participants', meetingId],
    queryFn: async () => {
      const url = meetingId ? `/meetings/${meetingId}/participants` : '/participants';
      const { data } = await api.get(url);
      return data.participants as Participant[];
    },
  });
}

export function useInviteParticipant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ meetingId, email, role }: { meetingId: string; email: string; role?: string }) => {
      const { data } = await api.post('/participants/invite', { meetingId, email, role });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['participants', variables.meetingId] });
    },
  });
}

export function useUpdateParticipantStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/participants/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  });
}
