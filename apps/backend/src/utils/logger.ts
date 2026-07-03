import { config } from '../config';

const isDev = config.nodeEnv === 'development';

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) {
      console.log('[INFO]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },
};
