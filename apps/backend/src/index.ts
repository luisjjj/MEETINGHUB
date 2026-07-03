import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { authRoutes } from './routes/auth.routes';
import { meetingRoutes } from './routes/meeting.routes';
import { participantRoutes } from './routes/participant.routes';
import { attendanceRoutes } from './routes/attendance.routes';
import { recordingRoutes } from './routes/recording.routes';
import { summaryRoutes } from './routes/summary.routes';
import { notificationRoutes } from './routes/notification.routes';
import { analyticsRoutes } from './routes/analytics.routes';
import { settingsRoutes } from './routes/settings.routes';
import { searchRoutes } from './routes/search.routes';
import { userRoutes } from './routes/user.routes';
import { departmentRoutes } from './routes/department.routes';
import { zoomWebhookRoutes } from './webhooks/zoom.webhook';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/recordings', recordingRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/search', searchRoutes);

// Webhooks
app.use('/webhooks/zoom', zoomWebhookRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

export default app;
