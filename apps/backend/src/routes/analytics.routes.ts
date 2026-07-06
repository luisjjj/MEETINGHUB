import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/dashboard', authenticate, async (_req, res) => {
  try {
    const meetingsResult = await db.query('SELECT COUNT(*) as total FROM meetings');
    const totalMeetings = parseInt(meetingsResult.rows[0].total);

    const hoursResult = await db.query(
      `SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600), 0) as hours FROM meetings WHERE end_time > start_time`
    );
    const hoursScheduled = Math.round(parseFloat(hoursResult.rows[0].hours) * 10) / 10;

    const attendanceResult = await db.query(
      `SELECT
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
        COUNT(*) as total
       FROM attendance`
    );
    const present = parseInt(attendanceResult.rows[0].present);
    const total = parseInt(attendanceResult.rows[0].total);
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    const summariesResult = await db.query(
      "SELECT COUNT(*) as pending FROM summaries WHERE status = 'pending'"
    );
    const aiSummariesPending = parseInt(summariesResult.rows[0].pending);

    const recordingsResult = await db.query('SELECT COUNT(*) as total FROM recordings');
    const recordingsAvailable = parseInt(recordingsResult.rows[0].total);

    res.json({
      stats: {
        totalMeetings,
        hoursScheduled,
        attendanceRate,
        aiSummariesPending,
        recordingsAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

router.get('/meetings', authenticate, async (_req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT
        TO_CHAR(DATE_TRUNC('month', start_time), 'Mon') as month,
        COUNT(*) as meetings
       FROM meetings
       WHERE start_time >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', start_time)
       ORDER BY DATE_TRUNC('month', start_time)`
    );
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meeting analytics' });
  }
});

router.get('/departments', authenticate, async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT d.name, COUNT(m.id)::int as value
       FROM departments d
       LEFT JOIN meetings m ON m.department_id = d.id
       WHERE d.is_active = true
       GROUP BY d.id, d.name
       ORDER BY value DESC`
    );
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch department analytics' });
  }
});

router.get('/attendance-trends', authenticate, async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT
        TO_CHAR(DATE_TRUNC('month', a.check_in_time), 'Mon') as month,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent
       FROM attendance a
       WHERE a.check_in_time >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', a.check_in_time)
       ORDER BY DATE_TRUNC('month', a.check_in_time)`
    );
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance trends' });
  }
});

router.get('/meeting-durations', authenticate, async (_req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT
        TO_CHAR(DATE_TRUNC('month', start_time), 'Mon') as month,
        ROUND(AVG(EXTRACT(EPOCH FROM (end_time - start_time)) / 60))::int as avg_duration
       FROM meetings
       WHERE end_time > start_time AND start_time >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', start_time)
       ORDER BY DATE_TRUNC('month', start_time)`
    );
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meeting durations' });
  }
});

export { router as analyticsRoutes };
