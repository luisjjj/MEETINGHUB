import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || String(q).trim().length < 2) {
      return res.json({ results: [] });
    }

    const searchTerm = `%${q}%`;
    const results: { type: string; id: string; title: string; description: string }[] = [];

    const meetings = await db.query(
      "SELECT id, title, description FROM meetings WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 10",
      [searchTerm]
    );
    for (const m of meetings.rows) {
      results.push({ type: 'meeting', id: m.id, title: m.title, description: m.description || '' });
    }

    const users = await db.query(
      'SELECT id, display_name as title, email as description FROM users WHERE display_name ILIKE $1 OR email ILIKE $1 LIMIT 10',
      [searchTerm]
    );
    for (const u of users.rows) {
      results.push({ type: 'participant', id: u.id, title: u.title, description: u.description || '' });
    }

    const recordings = await db.query(
      `SELECT r.id, m.title, r.url as description
       FROM recordings r JOIN meetings m ON r.meeting_id = m.id
       WHERE m.title ILIKE $1 OR r.transcript ILIKE $1 LIMIT 10`,
      [searchTerm]
    );
    for (const r of recordings.rows) {
      results.push({ type: 'recording', id: r.id, title: r.title, description: r.description || '' });
    }

    const summaries = await db.query(
      `SELECT s.id, m.title, s.executive_summary as description
       FROM summaries s JOIN meetings m ON s.meeting_id = m.id
       WHERE m.title ILIKE $1 OR s.executive_summary ILIKE $1 OR s.detailed_summary ILIKE $1 LIMIT 10`,
      [searchTerm]
    );
    for (const s of summaries.rows) {
      results.push({ type: 'summary', id: s.id, title: s.title, description: s.description || '' });
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search' });
  }
});

export { router as searchRoutes };
