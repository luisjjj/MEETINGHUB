import { db } from '../config/database';
import { logger } from '../utils/logger';

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [data.email]);

    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }

    const result = await db.query(
      'INSERT INTO users (email, display_name, role, is_active) VALUES ($1, $2, $3, $4) RETURNING id, email, display_name, role',
      [data.email, data.displayName, 'employee', true]
    );

    const user = result.rows[0];

    logger.info(`User registered: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    };
  }

  async login(data: LoginData) {
    const result = await db.query(
      'SELECT id, email, display_name, role FROM users WHERE email = $1 AND is_active = true',
      [data.email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    };
  }

  async getUserById(id: string) {
    const result = await db.query(
      'SELECT id, email, display_name, avatar_url, department_id, role, is_active, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];

    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      departmentId: user.department_id,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async refreshToken(userId: string) {
    const user = await this.getUserById(userId);
    return { user };
  }
}
