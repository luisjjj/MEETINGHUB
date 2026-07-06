import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  departmentId?: string;
  meetingType: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  room?: string;
  format: string;
  status: string;
  recordingEnabled: boolean;
  waitingRoomEnabled: boolean;
  passwordProtected: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalMeetings: number;
  hoursScheduled: number;
  attendanceRate: number;
  aiSummariesPending: number;
  recordingsAvailable: number;
}

export function useMeetings(params?: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['meetings', params],
    queryFn: async () => {
      const { data } = await api.get('/meetings', { params });
      return data;
    },
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: async () => {
      const { data } = await api.get(`/meetings/${id}`);
      return data as Meeting;
    },
    enabled: !!id,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (meeting: Partial<Meeting>) => {
      const { data } = await api.post('/meetings', meeting);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...meeting }: Partial<Meeting> & { id: string }) => {
      const { data } = await api.put(`/meetings/${id}`, meeting);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meeting', variables.id] });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meetings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/dashboard');
      return data.stats as DashboardStats;
    },
  });
}
