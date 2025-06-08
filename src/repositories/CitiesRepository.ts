import pool from '../db/postgres';
import { DatabaseException } from '../exceptions/database-exception';
import { City, NormalizedCityDTO } from '../types/dataTypes/cityData';
import { ErrorCode } from '../types/errorCodes';
import { ICitiesRepository } from '../types/repositories/ICitiesRepository';

class CitiesRepository implements ICitiesRepository {
  constructor() {}

  private async findCityById(id: number): Promise<City | null> {
    try {
      const query = `SELECT * FROM cities WHERE id = $1 LIMIT 1`;
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new DatabaseException(
        'Failed to find city by ID',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }
  private async findCityByName(name: string): Promise<City | null> {
    try {
      const query = `SELECT * FROM cities WHERE LOWER(name) = LOWER($1) LIMIT 1`;
      const result = await pool.query(query, [name]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new DatabaseException(
        'Failed to find city by name',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }

  async findCity(input: string | number): Promise<City | null> {
    if (typeof input === 'number') return this.findCityById(input);

    return this.findCityByName(input);
  }

  async addCity(data: NormalizedCityDTO): Promise<City> {
    const query = `INSERT INTO cities (name, country) VALUES ($1, $2) RETURNING *`;
    const values = [data.name, data.country];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async listCities(): Promise<City[]> {
    const query = `SELECT * FROM cities ORDER BY name`;
    const result = await pool.query(query);
    return result.rows;
  }

  async hardDeleteCity(id: number): Promise<City | undefined> {
    const query = `DELETE FROM cities WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default CitiesRepository;
