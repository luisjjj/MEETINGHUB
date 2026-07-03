import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({ users: [] });
});

router.get('/:id', authenticate, async (_req, res) => {
  res.json({ user: null });
});

router.put('/:id', authenticate, async (_req, res) => {
  res.json({ message: 'User updated' });
});

export { router as userRoutes };
