import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({ recordings: [] });
});

router.get('/:id', authenticate, async (_req, res) => {
  res.json({ recording: null });
});

router.post('/:id/download', authenticate, async (_req, res) => {
  res.json({ url: '' });
});

router.delete('/:id', authenticate, async (_req, res) => {
  res.json({ message: 'Recording deleted' });
});

export { router as recordingRoutes };
