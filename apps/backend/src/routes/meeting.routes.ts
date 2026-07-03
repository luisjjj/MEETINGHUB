import { Router } from 'express';
import { MeetingController } from '../controllers/meeting.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new MeetingController();

router.get('/', authenticate, controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);
router.get('/:id/participants', authenticate, controller.getParticipants);
router.post('/:id/start', authenticate, controller.startMeeting);
router.post('/:id/end', authenticate, controller.endMeeting);

export { router as meetingRoutes };
