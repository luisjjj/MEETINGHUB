import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const event = req.body;
    logger.info('Zoom webhook received:', event.event);

    switch (event.event) {
      case 'meeting.started':
        logger.info('Meeting started:', event.payload?.object?.id);
        break;
      case 'meeting.ended':
        logger.info('Meeting ended:', event.payload?.object?.id);
        break;
      case 'recording.completed':
        logger.info('Recording completed:', event.payload?.object?.id);
        break;
      default:
        logger.info('Unhandled Zoom event:', event.event);
    }

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    logger.error('Zoom webhook error:', error);
    res.status(400).json({ message: 'Webhook processing failed' });
  }
});

export { router as zoomWebhookRoutes };
