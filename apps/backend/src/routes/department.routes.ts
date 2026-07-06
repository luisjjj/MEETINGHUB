import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../config/database';

const router = Router();

router.get('/', authenticate, async (_req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, description, head_id, is_active, created_at, updated_at FROM departments WHERE is_active = true ORDER BY name'
    );
    res.json({ departments: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM departments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ department: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch department' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const result = await db.query(
      'INSERT INTO departments (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, req.user?.id || null]
    );
    res.status(201).json({ department: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create department' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, head_id, is_active } = req.body;
    const result = await db.query(
      `UPDATE departments SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        head_id = COALESCE($3, head_id),
        is_active = COALESCE($4, is_active),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name, description, head_id, is_active, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ department: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update department' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE departments SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete department' });
  }
});

export { router as departmentRoutes };
