import pool from '../../postgres';

export async function createCitiesTable(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       
      );
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_active_city_country
      ON cities (name, country)
     
    `);

    console.log('cities table and related objects created or already exist.');
  } catch (error) {
    console.error('Error creating cities table:', error);
    throw error;
  }
}
