import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { meeting_id, user_id, status } = req.query;
    let query = `
      SELECT p.id, p.meeting_id, p.user_id, p.status, p.role, p.invited_at, p.responded_at,
             u.display_name, u.email, u.avatar_url,
             m.title as meeting_title
      FROM participants p
      JOIN users u ON p.user_id = u.id
      JOIN meetings m ON p.meeting_id = m.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let idx = 1;

    if (meeting_id) {
      query += ` AND p.meeting_id = $${idx++}`;
      params.push(meeting_id);
    }
    if (user_id) {
      query += ` AND p.user_id = $${idx++}`;
      params.push(user_id);
    }
    if (status) {
      query += ` AND p.status = $${idx++}`;
      params.push(status);
    }

    query += ' ORDER BY p.invited_at DESC';
    const result = await db.query(query, params);
    res.json({ participants: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch participants' });
  }
});

router.post('/invite', authenticate, async (req, res) => {
  try {
    const { meeting_id, user_id, role } = req.body;
    if (!meeting_id || !user_id) {
      return res.status(400).json({ message: 'meeting_id and user_id are required' });
    }
    const result = await db.query(
      `INSERT INTO participants (meeting_id, user_id, role, status)
       VALUES ($1, $2, $3, 'pending')
       ON CONFLICT (meeting_id, user_id) DO UPDATE SET status = 'pending', responded_at = NULL
       RETURNING *`,
      [meeting_id, user_id, role || 'attendee']
    );

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES ($1, 'Meeting Invitation', 'You have been invited to a meeting', 'meeting_invite', $2)`,
      [user_id, `/meetings/${meeting_id}`]
    );

    res.status(201).json({ participant: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to invite participant' });
  }
});

router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['accepted', 'declined', 'tentative'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (accepted, declined, tentative)' });
    }
    const result = await db.query(
      'UPDATE participants SET status = $1, responded_at = NOW(), updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    res.json({ participant: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

export { router as participantRoutes };
