import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface AttendanceRecord {
  id: string;
  meetingId: string;
  userId: string;
  displayName?: string;
  email?: string;
  meetingTitle?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  qrCode?: string;
}

function mapRecord(r: any): AttendanceRecord {
  return {
    id: r.id,
    meetingId: r.meeting_id,
    userId: r.user_id,
    displayName: r.display_name,
    email: r.email,
    meetingTitle: r.meeting_title,
    checkInTime: r.check_in_time,
    checkOutTime: r.check_out_time,
    status: r.status,
    qrCode: r.qr_code,
  };
}

export function useAttendance(meetingId?: string) {
  return useQuery({
    queryKey: ['attendance', { meetingId }],
    queryFn: async () => {
      const { data } = await api.get('/attendance', { params: meetingId ? { meeting_id: meetingId } : {} });
      return (data.attendance || []).map(mapRecord) as AttendanceRecord[];
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingId, userId, status }: { meetingId: string; userId: string; status?: string }) => {
      const { data } = await api.post('/attendance/check-in', { meeting_id: meetingId, user_id: userId, status });
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['attendance'] }); },
  });
}

export function useGenerateQRCode() {
  return useMutation({
    mutationFn: async (meetingId: string) => {
      const { data } = await api.post('/attendance/qr-generate', { meeting_id: meetingId });
      return data.qrCode as string;
    },
  });
}

export function useExportAttendance() {
  return useMutation({
    mutationFn: async (meetingId: string) => {
      const { data } = await api.get('/attendance/export', { params: { meeting_id: meetingId } });
      return (data.data || []).map(mapRecord) as AttendanceRecord[];
    },
  });
}
