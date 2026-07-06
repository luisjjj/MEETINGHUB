import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { role, department_id, search } = req.query;
    let query = 'SELECT id, email, display_name, firebase_uid, avatar_url, department_id, role, is_active, created_at FROM users WHERE 1=1';
    const params: unknown[] = [];
    let idx = 1;

    if (role) {
      query += ` AND role = $${idx++}`;
      params.push(role);
    }
    if (department_id) {
      query += ` AND department_id = $${idx++}`;
      params.push(department_id);
    }
    if (search) {
      query += ` AND (display_name ILIKE $${idx} OR email ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    query += ' ORDER BY display_name';
    const result = await db.query(query, params);
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, display_name, firebase_uid, avatar_url, department_id, role, is_active, created_at, updated_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { display_name, email, department_id, role, is_active } = req.body;
    const result = await db.query(
      `UPDATE users SET
        display_name = COALESCE($1, display_name),
        email = COALESCE($2, email),
        department_id = COALESCE($3, department_id),
        role = COALESCE($4, role),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [display_name, email, department_id, role, is_active, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

export { router as userRoutes };
