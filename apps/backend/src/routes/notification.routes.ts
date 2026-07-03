import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({ notifications: [] });
});

router.put('/:id/read', authenticate, async (_req, res) => {
  res.json({ message: 'Notification marked as read' });
});

router.put('/read-all', authenticate, async (_req, res) => {
  res.json({ message: 'All notifications marked as read' });
});

export { router as notificationRoutes };
