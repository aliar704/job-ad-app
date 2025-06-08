import pool from '../../postgres';

export async function createCompaniesTable(): Promise<void> {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      employer_id INTEGER,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      website VARCHAR(255),
      phone VARCHAR(20),
      city_id INTEGER,
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP DEFAULT NULL
    );
  `);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS unique_active_name ON companies (name) WHERE deleted_at IS NULL;`);

    console.log('companies table and related objects created or already exist.');
  } catch (error) {
    console.error('Error creating companies table:', error);
    throw error;
  }
}
