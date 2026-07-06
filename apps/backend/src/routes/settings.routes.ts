import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM settings LIMIT 1');
    if (result.rows.length === 0) {
      const defaultResult = await db.query(
        `INSERT INTO settings (organization_name, timezone, date_format, time_format, default_meeting_duration)
         VALUES ('MeetingHub', 'UTC', 'MM/DD/YYYY', '12h', 60)
         RETURNING *`
      );
      return res.json({ settings: defaultResult.rows[0] });
    }
    res.json({ settings: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    const {
      organization_name, timezone, date_format, time_format,
      default_meeting_duration, enable_zoom_integration,
      enable_outlook_integration, enable_ai,
    } = req.body;

    const result = await db.query(
      `UPDATE settings SET
        organization_name = COALESCE($1, organization_name),
        timezone = COALESCE($2, timezone),
        date_format = COALESCE($3, date_format),
        time_format = COALESCE($4, time_format),
        default_meeting_duration = COALESCE($5, default_meeting_duration),
        enable_zoom_integration = COALESCE($6, enable_zoom_integration),
        enable_outlook_integration = COALESCE($7, enable_outlook_integration),
        enable_ai = COALESCE($8, enable_ai)
       WHERE id = (SELECT id FROM settings LIMIT 1)
       RETURNING *`,
      [organization_name, timezone, date_format, time_format,
       default_meeting_duration, enable_zoom_integration,
       enable_outlook_integration, enable_ai]
    );

    if (result.rows.length === 0) {
      const insertResult = await db.query(
        `INSERT INTO settings (organization_name, timezone, date_format, time_format, default_meeting_duration, enable_zoom_integration, enable_outlook_integration, enable_ai)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [organization_name || 'MeetingHub', timezone || 'UTC', date_format || 'MM/DD/YYYY',
         time_format || '12h', default_meeting_duration || 60,
         enable_zoom_integration ?? true, enable_outlook_integration ?? true, enable_ai ?? true]
      );
      return res.json({ settings: insertResult.rows[0] });
    }

    res.json({ settings: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

export { router as settingsRoutes };
