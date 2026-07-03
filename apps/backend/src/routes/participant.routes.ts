import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({ participants: [] });
});

router.post('/invite', authenticate, async (_req, res) => {
  res.json({ message: 'Invitation sent' });
});

router.put('/:id/status', authenticate, async (_req, res) => {
  res.json({ message: 'Status updated' });
});

export { router as participantRoutes };
