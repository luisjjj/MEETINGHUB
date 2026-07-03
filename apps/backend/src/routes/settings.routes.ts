import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  res.json({
    settings: {
      organizationName: 'MeetingHub',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      defaultMeetingDuration: 60,
      enableZoomIntegration: true,
      enableOutlookIntegration: true,
      enableAI: true,
    },
  });
});

router.put('/', authenticate, async (_req, res) => {
  res.json({ message: 'Settings updated' });
});

export { router as settingsRoutes };
