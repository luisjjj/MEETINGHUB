import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { event, payload } = req.body;

    logger.info(`Zoom webhook received: ${event}`);

    switch (event) {
      case 'meeting.started': {
        const meetingId = payload?.object?.id;
        if (meetingId) {
          await db.query(
            "UPDATE meetings SET status = 'in_progress', updated_at = NOW() WHERE zoom_meeting_id = $1",
            [meetingId]
          );
          logger.info(`Meeting started via Zoom webhook: ${meetingId}`);
        }
        break;
      }

      case 'meeting.ended': {
        const meetingId = payload?.object?.id;
        if (meetingId) {
          await db.query(
            "UPDATE meetings SET status = 'completed', updated_at = NOW() WHERE zoom_meeting_id = $1",
            [meetingId]
          );
          logger.info(`Meeting ended via Zoom webhook: ${meetingId}`);
        }
        break;
      }

      case 'recording.completed': {
        const recordingId = payload?.object?.id;
        const meetingId = payload?.object?.meeting_id;
        const files = payload?.object?.recording_files || [];

        if (recordingId && meetingId) {
          const mainFile = files.find((f: { file_type: string }) => f.file_type === 'MP4');
          if (mainFile) {
            const meeting = await db.query(
              'SELECT id FROM meetings WHERE zoom_meeting_id = $1',
              [meetingId]
            );

            if (meeting.rows.length > 0) {
              await db.query(
                `INSERT INTO recordings (meeting_id, zoom_recording_id, url, duration, file_size, status)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                  meeting.rows[0].id,
                  recordingId,
                  mainFile.download_url,
                  payload?.object?.duration || 0,
                  mainFile.file_size || 0,
                  'ready',
                ]
              );
              logger.info(`Recording saved via Zoom webhook: ${recordingId}`);
            }
          }
        }
        break;
      }

      case 'meeting.participant_joined': {
        const meetingId = payload?.object?.id;
        const participant = payload?.object?.participant;

        if (meetingId && participant) {
          const meeting = await db.query(
            'SELECT id FROM meetings WHERE zoom_meeting_id = $1',
            [meetingId]
          );

          if (meeting.rows.length > 0) {
            const user = await db.query(
              'SELECT id FROM users WHERE email = $1',
              [participant.email]
            );

            if (user.rows.length > 0) {
              await db.query(
                `INSERT INTO attendance (meeting_id, user_id, check_in_time, status)
                 VALUES ($1, $2, NOW(), 'present')
                 ON CONFLICT (meeting_id, user_id) 
                 DO UPDATE SET check_in_time = NOW(), status = 'present'`,
                [meeting.rows[0].id, user.rows[0].id]
              );
            }
          }
        }
        break;
      }

      case 'meeting.participant_left': {
        const meetingId = payload?.object?.id;
        const participant = payload?.object?.participant;

        if (meetingId && participant) {
          const meeting = await db.query(
            'SELECT id FROM meetings WHERE zoom_meeting_id = $1',
            [meetingId]
          );

          if (meeting.rows.length > 0) {
            const user = await db.query(
              'SELECT id FROM users WHERE email = $1',
              [participant.email]
            );

            if (user.rows.length > 0) {
              await db.query(
                `UPDATE attendance SET check_out_time = NOW() 
                 WHERE meeting_id = $1 AND user_id = $2`,
                [meeting.rows[0].id, user.rows[0].id]
              );
            }
          }
        }
        break;
      }

      default:
        logger.info(`Unhandled Zoom event: ${event}`);
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    logger.error('Zoom webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

export { router as zoomWebhookRoutes };
