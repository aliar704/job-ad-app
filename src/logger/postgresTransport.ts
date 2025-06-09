import Transport from 'winston-transport';
import pool from '../db/postgres';

export class PostgresTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    const { level, message, method, path, status_code, data, ...meta } = info;

    try {
      await pool.query(
        `INSERT INTO logs (level, message, method, path, status_code, data, meta)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [level, message, method || null, path || null, status_code || null, data || null, Object.keys(meta).length ? meta : null]
      );
    } catch (err) {
      console.error('Failed to log to PostgreSQL:', err);
    }

    callback();
  }
}
