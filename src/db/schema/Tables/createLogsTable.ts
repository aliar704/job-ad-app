import pool from '../../postgres';

export async function createLogsTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  method TEXT,
  path TEXT,
  status_code INTEGER,
  data JSONB,
  meta JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);
    console.log('logs table created or already exists.');
  } catch (error) {
    console.error('Error creating logs table:', error);
    throw error;
  }
}
