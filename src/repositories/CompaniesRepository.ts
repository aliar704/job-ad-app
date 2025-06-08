import pool from '../db/postgres';
import { Company, MappedCompany, NormalizedCompanyInput } from '../types/dataTypes/companyData';
import { ICompaniesRepository } from '../types/repositories/ICompaniesRepository';
import { mapCompanyRow } from '../utils/rowMapper';

class CompaniesRepository implements ICompaniesRepository {
  constructor() {}

  async createCompany(loggedUserId: number, data: NormalizedCompanyInput): Promise<Company> {
    const query = `INSERT INTO companies(employer_id,name,description,website,phone,city_id,address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    const values = [
      loggedUserId,
      data.name,
      data.description,
      data.website,
      data.phone,
      data.city_id,
      data.address,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async companyOwnershipCheck(loggedUserId: number, companyId: number): Promise<boolean> {
    const query = `SELECT 1 FROM companies WHERE id = $1 AND employer_id = $2 AND deleted_at IS NULL`;
    const values = [companyId, loggedUserId];
    const result = await pool.query(query, values);
    return result.rowCount! > 0;
  }
  async listCompanies(): Promise<Company[]> {
    const query = `SELECT * FROM companies WHERE deleted_at IS NULL `;
    const result = await pool.query(query);
    return result.rows;
  }
  async listUserCompanies(loggedUserId: number): Promise<Company[]> {
    const query = `SELECT * FROM companies WHERE employer_id=$1 AND deleted_at IS NULL `;
    const result = await pool.query(query, [loggedUserId]);
    return result.rows;
  }
  async listCityCompanies(cityId: number): Promise<Company[]> {
    const query = `
    SELECT companies.* 
    FROM companies 
    JOIN cities ON companies.city_id = cities.id 
    WHERE cities.id = $1 AND companies.deleted_at IS NULL
  `;
    const result = await pool.query(query, [cityId]);
    return result.rows;
  }

  private async findCompanyById(id: number): Promise<Company | null> {
    const query = `SELECT * FROM companies WHERE id = $1 AND deleted_at IS NULL `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
  private async findCompanyByName(name: string): Promise<Company | null> {
    const query = `SELECT * FROM companies WHERE name = $1 AND deleted_at IS NULL `;
    const result = await pool.query(query, [name]);
    return result.rows[0] || null;
  }
  async findCompany(input: string | number): Promise<Company | null> {
    if (typeof input === 'number') return this.findCompanyById(input);

    return this.findCompanyByName(input);
  }

  async getFullCompanyById(companyId: number): Promise<MappedCompany> {
    const query = `
    SELECT 
      c.*, 
      ci.name AS city_name,
      u.full_name AS employer_name
    FROM companies c
    JOIN cities ci ON c.city_id = ci.id
    JOIN users u ON c.employer_id = u.id
    WHERE c.id = $1 AND c.deleted_at IS NULL
  `;
    const result = await pool.query(query, [companyId]);

    return mapCompanyRow(result.rows[0]);
  }

  async updateCompany(companyId: number, data: NormalizedCompanyInput): Promise<Company> {
    const updateFields: string[] = [];
    const values: (number | string)[] = [];
    let index = 1;
    for (const key in data) {
      const typedKey = key as keyof NormalizedCompanyInput;
      if (data[typedKey] !== undefined) {
        updateFields.push(`${typedKey}=$${index++}`);
        values.push(data[typedKey] as string | number);
      }
    }
    values.push(companyId);
    const query = `UPDATE companies SET ${updateFields.join(
      ', '
    )} WHERE id = $${index} AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async findCityIdByCompanyId(companyId: number): Promise<number> {
    const query = `SELECT city_id FROM companies WHERE id = $1 AND deleted_at IS NULL `;
    const result = await pool.query(query, [companyId]);
    return result.rows[0].city_id;
  }

  async softDeleteCompany(companyId: number): Promise<Company> {
    const query = `UPDATE companies SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, [companyId]);
    return result.rows[0];
  }
}
export default CompaniesRepository;
