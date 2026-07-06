import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface MeetingAnalytics {
  totalMeetings: number;
  hoursScheduled: number;
  attendanceRate: number;
  aiSummariesPending: number;
  recordingsAvailable: number;
}

interface DepartmentActivity {
  name: string;
  value: number;
}

interface MeetingFrequency {
  month: string;
  meetings: number;
}

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/dashboard');
      return data.stats as MeetingAnalytics;
    },
  });
}

export function useMeetingFrequency() {
  return useQuery({
    queryKey: ['analytics', 'meeting-frequency'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/meetings');
      return data.data as MeetingFrequency[];
    },
  });
}

export function useDepartmentActivity() {
  return useQuery({
    queryKey: ['analytics', 'department-activity'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/departments');
      return data.data as DepartmentActivity[];
    },
  });
}
