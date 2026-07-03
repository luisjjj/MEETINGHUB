import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', authenticate, controller.logout);
router.post('/refresh-token', authenticate, controller.refreshToken);
router.get('/me', authenticate, controller.getMe);

export { router as authRoutes };
