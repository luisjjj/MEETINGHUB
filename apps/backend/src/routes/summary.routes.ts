import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({ summaries: [] });
});

router.get('/:id', authenticate, async (_req, res) => {
  res.json({ summary: null });
});

router.post('/generate', authenticate, async (_req, res) => {
  res.json({ message: 'Summary generation started' });
});

router.put('/:id', authenticate, async (_req, res) => {
  res.json({ message: 'Summary updated' });
});

export { router as summaryRoutes };
