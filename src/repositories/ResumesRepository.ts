import pool from '../db/postgres';
import { CreateResumeDTO, Resume, UpdateResumeDTO } from '../types/dataTypes/resumeData';
import { IResumesRepository } from '../types/repositories/IResumesRepository';

class ResumesRepository implements IResumesRepository {
  constructor() {}

  async addResume(loggedUserId: number, data: CreateResumeDTO): Promise<Resume> {
    const query = `INSERT INTO resumes (jobseeker_id,title,content,file_url) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
      loggedUserId,
      data.title,
      data.content,
      data.file_url,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async listLoggedUserResumes(loggedUserId: number): Promise<Resume[]> {
    const query = `SELECT * FROM resumes WHERE jobseeker_id=$1 AND deleted_at IS NULL`;
    const values = [loggedUserId];
    const result = await pool.query(query, values);
    return result.rows;
  }
  async resumeOwnershipCheck(loggedUserId: number, resumeId: number): Promise<boolean> {
    const query = `SELECT 1 FROM resumes WHERE id = $1 AND jobseeker_id = $2 AND deleted_at IS NULL LIMIT 1`;
    const values = [resumeId, loggedUserId];

    const result = await pool.query(query, values);
    return result.rowCount! > 0;
  }
  async findResume(resumeId: number): Promise<Resume | null> {
    const query = `SELECT * FROM resumes WHERE id = $1 AND deleted_at IS NULL`;
    const values = [resumeId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
  async updateResume(resumeId: number, data: UpdateResumeDTO): Promise<Resume> {
    const updateFields: string[] = [];
    const values: (number | string)[] = [];
    let index: number = 1;
    for (const key in data) {
      const typedKey = key as keyof UpdateResumeDTO;
      if (data[typedKey] !== undefined) {
        updateFields.push(`${typedKey} = $${index++}`);
        values.push(data[typedKey]);
      }
    }
    values.push(resumeId);
    const query = `UPDATE resumes SET ${updateFields.join(
      ', '
    )} WHERE id = $${index} AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async softDeleteResume(resumeId: number): Promise<Resume> {
    const query = `UPDATE resumes SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, [resumeId]);
    return result.rows[0];
  }
}

export default ResumesRepository;
