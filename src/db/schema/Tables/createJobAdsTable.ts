import pool from '../../postgres';

export async function createJobAdsTable(): Promise<void> {
  try {
    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
          CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'remote');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'xp_level') THEN
          CREATE TYPE xp_level AS ENUM ('junior', 'mid', 'senior');
        END IF;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_ads (
        id SERIAL PRIMARY KEY,
        employer_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        salary_min INTEGER,
        salary_max INTEGER,
        type job_type NOT NULL,
        experience_level xp_level NOT NULL,
        company_id INTEGER,
        city_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL
      );
    `);

    console.log('job_ads table and enums created or already exist.');
  } catch (error) {
    console.error('Error creating job_ads table:', error);
    throw error;
  }
}
