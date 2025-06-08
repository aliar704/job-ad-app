import pool from '../../postgres';

export async function createUsersTable(): Promise<void> {
  try {
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('admin', 'jobseeker', 'employer');
        END IF;
      END$$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        email VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role user_role NOT NULL,
        phone VARCHAR(20),
        birth_date DATE,
        city_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL
        );`);

    await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_active_email 
    ON users(email) 
    WHERE deleted_at IS NULL;
  `);

    console.log('Users table and profiles and related objects created or already exist.');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
}
