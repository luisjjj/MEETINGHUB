import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { config } from '../config';
import { db } from '../config/database';
import { logger } from '../utils/logger';

// Initialize Firebase Admin
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

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    let result = await db.query('SELECT id, email, role FROM users WHERE firebase_uid = $1', [
      decodedToken.uid,
    ]);

    if (result.rows.length === 0) {
      const insertResult = await db.query(
        `INSERT INTO users (firebase_uid, email, display_name, avatar_url, role)
         VALUES ($1, $2, $3, $4, 'employee')
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
    res.status(401).json({ message: 'Invalid token' });
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
