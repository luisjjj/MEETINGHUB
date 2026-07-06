import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface ZoomMeetingResult {
  zoomMeetingId: string;
  joinUrl: string;
  hostUrl: string;
  meetingId: string;
  password: string;
}

export function useCreateZoomMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      meetingId,
      topic,
      startTime,
      duration,
      timezone,
      password,
      waitingRoom,
    }: {
      meetingId: string;
      topic: string;
      startTime: string;
      duration: number;
      timezone?: string;
      password?: string;
      waitingRoom?: boolean;
    }) => {
      const { data } = await api.post<ZoomMeetingResult>(
        `/zoom/meetings/${meetingId}/create`,
        { topic, startTime, duration, timezone, password, waitingRoom }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meeting', variables.meetingId] });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useUpdateZoomMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      zoomMeetingId,
      topic,
      startTime,
      duration,
      timezone,
      password,
    }: {
      zoomMeetingId: string;
      topic?: string;
      startTime?: string;
      duration?: number;
      timezone?: string;
      password?: string;
    }) => {
      const { data } = await api.put(`/zoom/meetings/${zoomMeetingId}/update`, {
        topic,
        startTime,
        duration,
        timezone,
        password,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useDeleteZoomMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (zoomMeetingId: string) => {
      const { data } = await api.delete(`/zoom/meetings/${zoomMeetingId}/delete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useZoomRecordings(zoomMeetingId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(`/zoom/meetings/${zoomMeetingId}/recordings`);
      return data;
    },
  });
}

export function useZoomParticipants(zoomMeetingId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(`/zoom/meetings/${zoomMeetingId}/participants`);
      return data;
    },
  });
}

export function useSyncZoomRecordings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/zoom/recordings/sync');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
    },
  });
}
