import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';
import { config } from '../config';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { meeting_id, status } = req.query;
    let query = `
      SELECT s.*, m.title as meeting_title
      FROM summaries s
      JOIN meetings m ON s.meeting_id = m.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let idx = 1;

    if (meeting_id) {
      query += ` AND s.meeting_id = $${idx++}`;
      params.push(meeting_id);
    }
    if (status) {
      query += ` AND s.status = $${idx++}`;
      params.push(status);
    }

    query += ' ORDER BY s.created_at DESC';
    const result = await db.query(query, params);
    res.json({ summaries: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summaries' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT s.*, m.title as meeting_title FROM summaries s JOIN meetings m ON s.meeting_id = m.id WHERE s.id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Summary not found' });
    }
    res.json({ summary: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});

router.post('/generate', authenticate, async (req, res) => {
  try {
    const { meeting_id, type } = req.body;
    if (!meeting_id) {
      return res.status(400).json({ message: 'meeting_id is required' });
    }

    const meetingResult = await db.query('SELECT * FROM meetings WHERE id = $1', [meeting_id]);
    if (meetingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const meeting = meetingResult.rows[0];

    let content = '';
    const contentType = type || 'executive_summary';

    if (config.openai.apiKey) {
      try {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: config.openai.apiKey });

        const prompts: Record<string, string> = {
          executive_summary: `Provide an executive summary for a meeting titled "${meeting.title}" with description: "${meeting.description || 'No description'}"`,
          detailed_summary: `Provide a detailed summary for a meeting titled "${meeting.title}" with description: "${meeting.description || 'No description'}"`,
          action_items: `List action items for a meeting titled "${meeting.title}" with description: "${meeting.description || 'No description'}"`,
          key_decisions: `List key decisions for a meeting titled "${meeting.title}" with description: "${meeting.description || 'No description'}"`,
          follow_up_email: `Write a follow-up email for a meeting titled "${meeting.title}" with description: "${meeting.description || 'No description'}"`,
        };

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompts[contentType] || prompts.executive_summary }],
          max_tokens: 1000,
        });

        content = completion.choices[0]?.message?.content || '';
      } catch {
        content = `AI summary for "${meeting.title}" - OpenAI API key may not be configured or the service may be unavailable.`;
      }
    } else {
      content = `Summary for "${meeting.title}" - OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment.`;
    }

    const result = await db.query(
      `INSERT INTO summaries (meeting_id, ${contentType.replace(/_/g, '_')}, status, generated_at)
       VALUES ($1, $2, 'completed', NOW())
       ON CONFLICT (meeting_id) DO UPDATE SET ${contentType.replace(/_/g, '_')} = $2, status = 'completed', generated_at = NOW()
       RETURNING *`,
      [meeting_id, content]
    );

    res.status(201).json({ summary: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate summary' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { executive_summary, detailed_summary, action_items, key_decisions, follow_up_tasks, who_said_what } = req.body;
    const result = await db.query(
      `UPDATE summaries SET
        executive_summary = COALESCE($1, executive_summary),
        detailed_summary = COALESCE($2, detailed_summary),
        action_items = COALESCE($3, action_items),
        key_decisions = COALESCE($4, key_decisions),
        follow_up_tasks = COALESCE($5, follow_up_tasks),
        who_said_what = COALESCE($6, who_said_what),
        updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [executive_summary, detailed_summary, action_items, key_decisions, follow_up_tasks, who_said_what, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Summary not found' });
    }
    res.json({ summary: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update summary' });
  }
});

export { router as summaryRoutes };
