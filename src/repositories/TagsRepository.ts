import pool from '../db/postgres';
import { Tag } from '../types/dataTypes/tagData';
import { ITagsRepository } from '../types/repositories/ITagsRepository';

class TagsRepository implements ITagsRepository {
  constructor() {}

  async findTag(input: string | number): Promise<Tag | null> {
    const isNumber = typeof input === 'number';
    const query = isNumber
      ? `SELECT * FROM tags WHERE id = $1`
      : `SELECT * FROM tags WHERE name = $1`;
    const values = [input];

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async addTag(name: string): Promise<Tag> {
    const query = `
  INSERT INTO tags (name)
  VALUES ($1)
  ON CONFLICT (name) DO NOTHING
  RETURNING *;
  `;
    const values = [name];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async listTags(): Promise<Tag[]> {
    const query = `SELECT * FROM tags`;
    const result = await pool.query(query);
    return result.rows;
  }

  async hardDeleteTag(tagId: number): Promise<Tag> {
    const query = `DELETE FROM tags WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [tagId]);
    return result.rows[0];
  }
}

export default TagsRepository;
