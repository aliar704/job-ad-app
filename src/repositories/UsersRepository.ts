import pool from '../db/postgres';
import { IUsersRepository } from '../types/repositories/IUsersRepository';
import { DatabaseException } from '../exceptions/database-exception'; 
import { NormalizedUserInput, User } from '../types/dataTypes/userData';
import { ErrorCode } from '../types/errorCodes';

class UsersRepository implements IUsersRepository {
  constructor() {}

  private async findUserById(id: number): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`;
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new DatabaseException(
        'Failed to find user by ID',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`;
      const result = await pool.query(query, [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw new DatabaseException(
        'Failed to find user by email',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }

  async findUser(input: number | string): Promise<User | null> {
    if (typeof input === 'number') {
      return this.findUserById(input);
    }
    return this.findUserByEmail(input);
  }

  async createUser(data: NormalizedUserInput): Promise<User> {
    try {
      const query = `
        INSERT INTO users (email, password_hash, full_name, role, phone, birth_date, city_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const values = [
        data.email,
        data.password_hash,
        data.full_name,
        data.role,
        data.phone,
        data.birth_date,
        data.city_id,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException(
        'Failed create user',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }

  async listUsers(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users WHERE deleted_at IS NULL`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new DatabaseException(
        'Failed to list users',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }

  async updateUser(userId: number, data: NormalizedUserInput): Promise<User> {
    try {
      const updateFields: string[] = [];
      const values: (string | number)[] = [];
      let index = 1;

      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          updateFields.push(`${key} = $${index++}`);
          values.push(value);
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No fields provided for update');
      }

      values.push(userId);

      const query = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id = $${index} AND deleted_at IS NULL
        RETURNING *;
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException(
        'Failed to update user',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }

  async softDeleteUser(userId: number): Promise<User> {
    try {
      const query = `
        UPDATE users
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *;
      `;
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException(
        'Failed to soft delete user',
        ErrorCode.INTERNAL_DATABASE_EXCEPTION,
        error
      );
    }
  }
}

export default UsersRepository;
