import pool from '../../postgres';

export async function createApplicationsTable(): Promise<void> {
  try {
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
          CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected','cancelled');
        END IF;
      END$$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        jobseeker_id INTEGER NOT NULL,
        job_ad_id INTEGER NOT NULL,
        resume_id INTEGER NOT NULL,
        status application_status NOT NULL DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes WHERE indexname = 'unique_user_job_partial'
    ) THEN
      CREATE UNIQUE INDEX unique_user_job_partial
      ON applications (jobseeker_id, job_ad_id)
      WHERE status != 'cancelled';
    END IF;
  END$$;
`);

    console.log('applications table and enum created or already exist.');
  } catch (error) {
    console.error('Error creating applications table:', error);
    throw error;
  }
}
