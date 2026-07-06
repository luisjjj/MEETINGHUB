import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { zoomController } from '../controllers/zoom.controller';

const router = Router();

router.post('/meetings/:meetingId/create', authenticate, zoomController.createMeeting);
router.put('/meetings/:zoomMeetingId/update', authenticate, zoomController.updateMeeting);
router.delete('/meetings/:zoomMeetingId/delete', authenticate, zoomController.deleteMeeting);
router.get('/meetings/:zoomMeetingId/recordings', authenticate, zoomController.getMeetingRecordings);
router.get('/meetings/:zoomMeetingId/participants', authenticate, zoomController.getMeetingParticipants);
router.get('/recordings', authenticate, zoomController.listRecordings);
router.post('/recordings/sync', authenticate, zoomController.syncRecordings);

export { router as zoomRoutes };
