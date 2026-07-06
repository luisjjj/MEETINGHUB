import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { zoomService } from '../services/zoom.service';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class ZoomController {
  createMeeting = async (req: AuthRequest, res: Response) => {
    try {
      const meetingId = req.params.meetingId as string;
      const { topic, startTime, duration, timezone, password, waitingRoom } = req.body;

      const meeting = await zoomService.createMeeting({
        topic,
        startTime,
        duration,
        timezone,
        password,
        waitingRoom,
      });

      await db.query(
        `UPDATE meetings SET 
          zoom_meeting_id = $1, 
          zoom_join_url = $2, 
          zoom_host_url = $3,
          updated_at = NOW()
        WHERE id = $4`,
        [meeting.id, meeting.join_url, meeting.start_url, meetingId]
      );

      logger.info(`Zoom meeting created for meeting ${meetingId}`);
      res.json({
        zoomMeetingId: meeting.id,
        joinUrl: meeting.join_url,
        hostUrl: meeting.start_url,
        meetingId: meeting.meeting_id,
        password: meeting.password,
      });
    } catch (error) {
      logger.error('Failed to create Zoom meeting:', error);
      res.status(500).json({ message: 'Failed to create Zoom meeting' });
    }
  };

  updateMeeting = async (req: AuthRequest, res: Response) => {
    try {
      const zoomMeetingId = req.params.zoomMeetingId as string;
      const { topic, startTime, duration, timezone, password } = req.body;

      await zoomService.updateMeeting(zoomMeetingId, {
        topic,
        startTime,
        duration,
        timezone,
        password,
      });

      logger.info(`Zoom meeting updated: ${zoomMeetingId}`);
      res.json({ message: 'Zoom meeting updated successfully' });
    } catch (error) {
      logger.error('Failed to update Zoom meeting:', error);
      res.status(500).json({ message: 'Failed to update Zoom meeting' });
    }
  };

  deleteMeeting = async (req: AuthRequest, res: Response) => {
    try {
      const zoomMeetingId = req.params.zoomMeetingId as string;

      await zoomService.deleteMeeting(zoomMeetingId);

      await db.query(
        `UPDATE meetings SET 
          zoom_meeting_id = NULL,
          zoom_join_url = NULL,
          zoom_host_url = NULL,
          updated_at = NOW()
        WHERE zoom_meeting_id = $1`,
        [zoomMeetingId]
      );

      logger.info(`Zoom meeting deleted: ${zoomMeetingId}`);
      res.json({ message: 'Zoom meeting deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete Zoom meeting:', error);
      res.status(500).json({ message: 'Failed to delete Zoom meeting' });
    }
  };

  getMeetingRecordings = async (req: AuthRequest, res: Response) => {
    try {
      const zoomMeetingId = req.params.zoomMeetingId as string;

      const recordings = await zoomService.getMeetingRecordings(zoomMeetingId);

      res.json({
        recordings: recordings.recording_files.map((file) => ({
          id: file.id,
          fileType: file.file_type,
          fileSize: file.file_size,
          playUrl: file.play_url,
          downloadUrl: file.download_url,
          status: file.status,
        })),
        topic: recordings.topic,
        startTime: recordings.start_time,
        duration: recordings.duration,
      });
    } catch (error) {
      logger.error('Failed to get Zoom recordings:', error);
      res.status(500).json({ message: 'Failed to get recordings' });
    }
  };

  getMeetingParticipants = async (req: AuthRequest, res: Response) => {
    try {
      const zoomMeetingId = req.params.zoomMeetingId as string;

      const result = await zoomService.getMeetingParticipants(zoomMeetingId);

      res.json({
        participants: result.participants.map((p) => ({
          id: p.id,
          email: p.user_email,
          name: p.user_name,
          joinTime: p.join_time,
          leaveTime: p.leave_time,
          duration: p.duration,
        })),
      });
    } catch (error) {
      logger.error('Failed to get Zoom participants:', error);
      res.status(500).json({ message: 'Failed to get participants' });
    }
  };

  listRecordings = async (req: AuthRequest, res: Response) => {
    try {
      const { from, to, page_size, next_page_token } = req.query;

      const result = await zoomService.listRecordings({
        from: from as string,
        to: to as string,
        page_size: page_size ? Number(page_size) : undefined,
        next_page_token: next_page_token as string,
      });

      res.json({
        meetings: result.meetings,
        nextPageToken: result.next_page_token,
        pageCount: result.page_count,
        pageSize: result.page_size,
        totalRecordings: result.total_recordings,
      });
    } catch (error) {
      logger.error('Failed to list Zoom recordings:', error);
      res.status(500).json({ message: 'Failed to list recordings' });
    }
  };

  syncRecordings = async (req: AuthRequest, res: Response) => {
    try {
      const result = await zoomService.listRecordings({ page_size: 100 });

      for (const recording of result.meetings) {
        const existing = await db.query(
          'SELECT id FROM recordings WHERE zoom_recording_id = $1',
          [recording.id]
        );

        if (existing.rows.length === 0 && recording.recording_files.length > 0) {
          const mainFile = recording.recording_files.find((f) => f.file_type === 'MP4');
          if (mainFile) {
            await db.query(
              `INSERT INTO recordings (meeting_id, zoom_recording_id, url, duration, file_size, status, created_by)
               VALUES ((SELECT id FROM meetings WHERE zoom_meeting_id = $1 LIMIT 1), $2, $3, $4, $5, $6, $7)`,
              [
                recording.meeting_id,
                recording.id,
                mainFile.download_url,
                recording.duration,
                mainFile.file_size,
                mainFile.status === 'completed' ? 'ready' : 'processing',
                req.user?.id,
              ]
            );
          }
        }
      }

      logger.info('Zoom recordings synced successfully');
      res.json({ message: 'Recordings synced successfully', count: result.meetings.length });
    } catch (error) {
      logger.error('Failed to sync Zoom recordings:', error);
      res.status(500).json({ message: 'Failed to sync recordings' });
    }
  };
}

export const zoomController = new ZoomController();
