import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({ attendance: [] });
});

router.post('/check-in', authenticate, async (_req, res) => {
  res.json({ message: 'Checked in successfully' });
});

router.post('/qr-generate', authenticate, async (_req, res) => {
  res.json({ qrCode: 'data:image/png;base64,...' });
});

router.get('/export', authenticate, async (_req, res) => {
  res.json({ data: [] });
});

export { router as attendanceRoutes };
