import pool from '../../postgres';

export async function createJobTagsTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_tags (
        job_ad_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (job_ad_id, tag_id)
      );
    `);
    console.log('job_tags table created or already exists.');
  } catch (error) {
    console.error('Error creating job_tags table:', error);
    throw error;
  }
}
