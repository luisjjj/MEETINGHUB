import pg from 'pg';
import { config } from './index';

const pool = new pg.Pool({
  connectionString: config.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};

export default db;
