import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';
import QRCode from 'qrcode';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { meeting_id, user_id, status } = req.query;
    let query = `
      SELECT a.id, a.meeting_id, a.user_id, a.check_in_time, a.check_out_time, a.status, a.qr_code,
             u.display_name, u.email, u.avatar_url,
             m.title as meeting_title
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      JOIN meetings m ON a.meeting_id = m.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let idx = 1;

    if (meeting_id) {
      query += ` AND a.meeting_id = $${idx++}`;
      params.push(meeting_id);
    }
    if (user_id) {
      query += ` AND a.user_id = $${idx++}`;
      params.push(user_id);
    }
    if (status) {
      query += ` AND a.status = $${idx++}`;
      params.push(status);
    }

    query += ' ORDER BY a.check_in_time DESC';
    const result = await db.query(query, params);
    res.json({ attendance: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

router.post('/check-in', authenticate, async (req, res) => {
  try {
    const { meeting_id, user_id, status } = req.body;
    if (!meeting_id || !user_id) {
      return res.status(400).json({ message: 'meeting_id and user_id are required' });
    }
    const result = await db.query(
      `INSERT INTO attendance (meeting_id, user_id, check_in_time, status)
       VALUES ($1, $2, NOW(), $3)
       ON CONFLICT (meeting_id, user_id) DO UPDATE SET check_in_time = NOW(), status = $3
       RETURNING *`,
      [meeting_id, user_id, status || 'present']
    );
    res.status(201).json({ attendance: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check in' });
  }
});

router.post('/check-out', authenticate, async (req, res) => {
  try {
    const { meeting_id, user_id } = req.body;
    if (!meeting_id || !user_id) {
      return res.status(400).json({ message: 'meeting_id and user_id are required' });
    }
    const result = await db.query(
      'UPDATE attendance SET check_out_time = NOW() WHERE meeting_id = $1 AND user_id = $2 RETURNING *',
      [meeting_id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ attendance: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check out' });
  }
});

router.post('/qr-generate', authenticate, async (req, res) => {
  try {
    const { meeting_id } = req.body;
    if (!meeting_id) {
      return res.status(400).json({ message: 'meeting_id is required' });
    }
    const qrData = JSON.stringify({ meeting_id, timestamp: Date.now() });
    const qrCode = await QRCode.toDataURL(qrData);

    await db.query(
      'UPDATE meetings SET password = $1 WHERE id = $2',
      [qrData, meeting_id]
    );

    res.json({ qrCode, meeting_id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
});

router.get('/export', authenticate, async (req, res) => {
  try {
    const { meeting_id } = req.query;
    let query = `
      SELECT a.*, u.display_name, u.email, m.title as meeting_title
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      JOIN meetings m ON a.meeting_id = m.id
    `;
    const params: unknown[] = [];
    if (meeting_id) {
      query += ' WHERE a.meeting_id = $1';
      params.push(meeting_id);
    }
    query += ' ORDER BY m.start_time, u.display_name';

    const result = await db.query(query, params);
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to export attendance' });
  }
});

export { router as attendanceRoutes };
