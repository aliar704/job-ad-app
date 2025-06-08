import pool from '../../postgres';

export async function createTagsTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('tags table created or already exists.');
  } catch (error) {
    console.error('Error creating tags table:', error);
    throw error;
  }
}
