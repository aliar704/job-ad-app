import Transport from 'winston-transport';
import pool from '../db/postgres';

export class PostgresTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));
    const { level, message, ...meta } = info;

    try {
      await pool.query(`INSERT INTO logs (level, message, meta) VALUES ($1, $2, $3)`, [level, message, meta]);
    } catch (err) {
      console.error('Failed to log to PostgreSQL:', err);
    }

    callback();
  }
}
