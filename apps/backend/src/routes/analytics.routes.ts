import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, async (_req, res) => {
  res.json({
    stats: {
      totalMeetings: 0,
      hoursScheduled: 0,
      attendanceRate: 0,
      aiSummariesPending: 0,
      recordingsAvailable: 0,
    },
  });
});

router.get('/meetings', authenticate, async (_req, res) => {
  res.json({ data: [] });
});

router.get('/departments', authenticate, async (_req, res) => {
  res.json({ data: [] });
});

export { router as analyticsRoutes };
