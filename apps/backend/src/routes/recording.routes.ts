import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { meeting_id, status } = req.query;
    let query = `
      SELECT r.*, m.title as meeting_title
      FROM recordings r
      JOIN meetings m ON r.meeting_id = m.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let idx = 1;

    if (meeting_id) {
      query += ` AND r.meeting_id = $${idx++}`;
      params.push(meeting_id);
    }
    if (status) {
      query += ` AND r.status = $${idx++}`;
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';
    const result = await db.query(query, params);
    res.json({ recordings: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recordings' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT r.*, m.title as meeting_title FROM recordings r JOIN meetings m ON r.meeting_id = m.id WHERE r.id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recording not found' });
    }
    res.json({ recording: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recording' });
  }
});

router.post('/:id/download', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT url FROM recordings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recording not found' });
    }
    res.json({ url: result.rows[0].url });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get download URL' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM recordings WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recording not found' });
    }
    res.json({ message: 'Recording deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recording' });
  }
});

export { router as recordingRoutes };
