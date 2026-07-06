import pg from 'pg';
import { config } from './index';
import { logger } from '../utils/logger';

const pool = new pg.Pool({
  connectionString: config.database.url,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  allowExitOnIdle: true,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', err);
});

pool.on('connect', () => {
  logger.debug('New database connection established');
});

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};

export default db;
