import pool from '../../postgres';

export async function createLogsTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  meta JSONB,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
    `);
    console.log('logs table created or already exists.');
  } catch (error) {
    console.error('Error creating logs table:', error);
    throw error;
  }
}
