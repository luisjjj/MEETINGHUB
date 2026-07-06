import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ZoomMeeting {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  start_url: string;
  meeting_id: string;
  password: string;
  status: string;
}

interface ZoomRecording {
  id: string;
  meeting_id: string;
  recording_files: Array<{
    id: string;
    file_type: string;
    file_size: number;
    play_url: string;
    download_url: string;
    status: string;
  }>;
  topic: string;
  start_time: string;
  duration: number;
}

export class ZoomService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<ZoomTokenResponse>(
        'https://zoom.us/oauth/token',
        null,
        {
          params: {
            grant_type: 'account_credentials',
            account_id: config.zoom.accountId,
          },
          auth: {
            username: config.zoom.clientId,
            password: config.zoom.clientSecret,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

      return this.accessToken;
    } catch (error) {
      logger.error('Failed to get Zoom access token:', error);
      throw new Error('Zoom authentication failed');
    }
  }

  private async makeRequest<T>(method: string, url: string, data?: unknown): Promise<T> {
    const token = await this.getAccessToken();
    const response = await axios({
      method,
      url: `https://api.zoom.us/v2${url}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  async createMeeting(params: {
    topic: string;
    startTime: string;
    duration: number;
    timezone?: string;
    password?: string;
    waitingRoom?: boolean;
  }): Promise<ZoomMeeting> {
    const meeting = await this.makeRequest<ZoomMeeting>('POST', '/users/me/meetings', {
      topic: params.topic,
      type: 2, // Scheduled meeting
      start_time: params.startTime,
      duration: params.duration,
      timezone: params.timezone || 'UTC',
      password: params.password,
      settings: {
        waiting_room: params.waitingRoom ?? true,
        host_video: true,
        participant_video: true,
        allow_multiple_devices: true,
      },
    });

    logger.info(`Zoom meeting created: ${meeting.id}`);
    return meeting;
  }

  async updateMeeting(meetingId: string, params: {
    topic?: string;
    startTime?: string;
    duration?: number;
    timezone?: string;
    password?: string;
  }): Promise<void> {
    await this.makeRequest('PATCH', `/meetings/${meetingId}`, {
      topic: params.topic,
      start_time: params.startTime,
      duration: params.duration,
      timezone: params.timezone,
      password: params.password,
    });

    logger.info(`Zoom meeting updated: ${meetingId}`);
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    await this.makeRequest('DELETE', `/meetings/${meetingId}`);
    logger.info(`Zoom meeting deleted: ${meetingId}`);
  }

  async getMeeting(meetingId: string): Promise<ZoomMeeting> {
    return this.makeRequest<ZoomMeeting>('GET', `/meetings/${meetingId}`);
  }

  async getMeetingRecordings(meetingId: string): Promise<ZoomRecording> {
    return this.makeRequest<ZoomRecording>('GET', `/meetings/${meetingId}/recordings`);
  }

  async getMeetingParticipants(meetingId: string): Promise<{
    participants: Array<{
      id: string;
      user_email: string;
      user_name: string;
      join_time: string;
      leave_time: string;
      duration: number;
    }>;
  }> {
    return this.makeRequest('GET', `/meetings/${meetingId}/participants`);
  }

  async listRecordings(params?: {
    from?: string;
    to?: string;
    page_size?: number;
    next_page_token?: string;
  }): Promise<{
    meetings: ZoomRecording[];
    next_page_token: string;
    page_count: number;
    page_size: number;
    total_recordings: number;
  }> {
    return this.makeRequest('GET', '/users/me/recordings', { params });
  }

  async getRecordingDownloadUrl(recordingId: string, fileId: string): Promise<string> {
    const recording = await this.makeRequest<ZoomRecording>('GET', `/recordings/${recordingId}`);
    const file = recording.recording_files.find((f) => f.id === fileId);
    if (!file) {
      throw new Error('Recording file not found');
    }
    return file.download_url;
  }

  parseWebhookEvent(payload: unknown): { event: string; data: unknown } {
    const data = payload as { event?: string; payload?: unknown };
    return {
      event: data.event || 'unknown',
      data: data.payload || payload,
    };
  }
}

export const zoomService = new ZoomService();
