import pool from '../db/postgres';
import { JobTag } from '../types/dataTypes/jobTagData';
import { IJobTagsRepository } from '../types/repositories/IJobTagsRepository';

class JobTagsRepository implements IJobTagsRepository {
  constructor() {}

  async findJobTag(jobAdId: number, tagId: number): Promise<JobTag | null> {
    const query = `SELECT FROM job_tags WHERE job_ad_id=$1 AND tag_id=$2`;
    const values = [jobAdId, tagId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
  async getFullJobTag(jobAdId: number): Promise<any | null> {
    const query = ` SELECT 
      ja.*,
      COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags
    FROM job_ads ja
    LEFT JOIN job_tags jt ON ja.id = jt.job_ad_id
    LEFT JOIN tags t ON jt.tag_id = t.id
    WHERE ja.id = $1
    GROUP BY ja.id`;
    const values = [jobAdId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
  async listFullJobAdsWithTags(): Promise<any[]> {
  const query = `
    SELECT 
      ja.*,
      COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags
    FROM job_ads ja
    LEFT JOIN job_tags jt ON ja.id = jt.job_ad_id
    LEFT JOIN tags t ON jt.tag_id = t.id
    WHERE ja.deleted_at IS NULL
    GROUP BY ja.id
  `;
  const result = await pool.query(query);
  return result.rows;
}

  async addJobTag(jobAdId: number, tagIds: number[]): Promise<void> {
    for (const tagId of tagIds) {
      await pool.query(
        `INSERT INTO job_tags (job_ad_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [jobAdId, tagId]
      );
    }
  }
  async updateJobTags(jobAdId: number, tagIds: number[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(`DELETE FROM job_tags WHERE job_ad_id = $1`, [jobAdId]);

      for (const tagId of tagIds) {
        await client.query(
          `INSERT INTO job_tags (job_ad_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [jobAdId, tagId]
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async listJobTags(): Promise<JobTag[]> {
    const query = `SELECT * FROM job_tags`;
    const result = await pool.query(query);
    return result.rows;
  }

  async hardDeleteJobTag(jobAdId: number, tagId: number): Promise<void> {
    await pool.query(`DELETE FROM job_tags WHERE job_ad_id=$1 AND tag_id=$2`, [jobAdId, tagId]);
  }
  async jobTagOwnershipCheck(loggedUserId: number, jobAdId: number): Promise<boolean> {
    const query = `SELECT 1 FROM job_ads WHERE id = $1 AND employer_id = $2 AND deleted_at IS NULL`;
    const values = [jobAdId, loggedUserId];
    const result = await pool.query(query, values);
    return result.rowCount! > 0;
  }
}
export default JobTagsRepository;
