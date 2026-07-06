import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { config } from '../config';
import { db } from '../config/database';
import { logger } from '../utils/logger';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.firebase.clientEmail,
    }),
  });
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

async function queryWithRetry(text: string, params?: unknown[], retries = 2): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await db.query(text, params);
    } catch (err: any) {
      if (attempt < retries && (err.code === 'ECONNRESET' || err.code === '57P01' || err.message?.includes('timeout'))) {
        logger.warn(`DB query attempt ${attempt + 1} failed, retrying...`);
        continue;
      }
      throw err;
    }
  }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    let result = await queryWithRetry('SELECT id, email, role FROM users WHERE firebase_uid = $1', [
      decodedToken.uid,
    ]);

    if (result.rows.length === 0) {
      const insertResult = await queryWithRetry(
        `INSERT INTO users (firebase_uid, email, display_name, avatar_url, role)
         VALUES ($1, $2, $3, $4, 'employee')
         ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email
         RETURNING id, email, role`,
        [
          decodedToken.uid,
          decodedToken.email || '',
          decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
          decodedToken.picture || null,
        ]
      );
      result = insertResult;
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(503).json({ message: 'Service temporarily unavailable' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
