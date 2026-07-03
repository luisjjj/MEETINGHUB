import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({ departments: [] });
});

router.post('/', authenticate, async (_req, res) => {
  res.json({ message: 'Department created' });
});

router.put('/:id', authenticate, async (_req, res) => {
  res.json({ message: 'Department updated' });
});

router.delete('/:id', authenticate, async (_req, res) => {
  res.json({ message: 'Department deleted' });
});

export { router as departmentRoutes };
