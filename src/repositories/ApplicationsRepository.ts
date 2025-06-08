import pool from '../db/postgres';
import { Application, CreateApplicationDTO, STATUS } from '../types/dataTypes/applicationData';
import { IApplicationsRepository } from '../types/repositories/IApplicationsRepository';

class ApplicationsRepository implements IApplicationsRepository {
  constructor() {}

  async applicationOwnershipCheck(loggedUserId: number, applicationId: number): Promise<boolean> {
    const query = `SELECT 1 FROM applications WHERE id = $1 AND jobseeker_id = $2 AND status <> 'cancelled'`;
    const values = [applicationId, loggedUserId];
    const result = await pool.query(query, values);
    return result.rowCount! > 0;
  }
  async findApplication(applicationId: number):  Promise<Application | null> {
    const query = `SELECT * FROM applications WHERE id = $1 AND status <> 'cancelled'`;
    const values = [applicationId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async isAlreadyApplied(loggedUserId: number,jobAdId:number):  Promise<boolean> {
    const query = `SELECT 1 FROM applications WHERE jobseeker_id = $1 AND job_ad_id=$2 AND status <> 'cancelled'`;
    const values = [loggedUserId,jobAdId];
    const result = await pool.query(query, values);
    return result.rowCount! > 0;
  }

  async createApplication(loggedUserId: number, data: CreateApplicationDTO): Promise<Application> {
    const query = `INSERT INTO applications (jobseeker_id,job_ad_id,resume_id) VALUES ($1, $2, $3) RETURNING *;`;
    const values = [loggedUserId, data.job_ad_id, data.resume_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async listApplications(loggedUserId: number): Promise<Application[]> {
    const query = `SELECT * FROM applications WHERE jobseeker_id=$1 AND status <> 'cancelled' `;
    const values = [loggedUserId];
    const result = await pool.query(query, values);
    return result.rows;
  }
 async listAllApplicationsInfo(userId: number): Promise<any[]> {
  const query = `
    SELECT 
      a.id AS application_id,
      a.status,
      a.applied_at,
      a.resume_id,

      -- Resume
      r.id AS resume_id,
      r.title AS resume_title,
      r.content AS resume_content,
      r.file_url AS resume_file_url,

      -- Job Ad
      ja.id AS jobad_id,
      ja.title AS jobad_title,
      ja.description AS jobad_description,
      ja.salary_min,
      ja.salary_max,
      ja.type AS jobad_type,
      ja.experience_level AS jobad_experience_level,
      ja.created_at AS jobad_created_at,

      -- Company
      c.id AS company_id,
      c.name AS company_name,
      c.description AS company_description,
      c.website,
      c.phone,
      c.city_id AS company_city_id,
      c.address AS company_address,
      c.created_at AS company_created_at

    FROM applications a
    JOIN resumes r ON a.resume_id = r.id
    JOIN job_ads ja ON a.job_ad_id = ja.id
    JOIN companies c ON ja.company_id = c.id
    WHERE a.jobseeker_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

  async cancelApplication(applicationId: number): Promise<Application> {
    const query = `UPDATE applications SET status = 'cancelled' WHERE id = $1 AND status <> 'cancelled' RETURNING *`;
    const result = await pool.query(query, [applicationId]);
    return result.rows[0];
  }
  async changeApplicationStatus(applicationId: number,applicationStatus:STATUS): Promise<Application> {
    const query = `UPDATE applications SET status = $1 WHERE id = $2 AND status <> 'cancelled' RETURNING *`;
    const result = await pool.query(query, [applicationStatus,applicationId]);
    return result.rows[0];
  }
  async getTopJobSeekersByApplications(limit: number = 3): Promise<any[]> {
    const query = `
    SELECT u.id, u.full_name, u.email, COUNT(a.id) AS application_count
    FROM users u
    JOIN applications a ON u.id = a.jobseeker_id
    WHERE u.deleted_at IS NULL
    GROUP BY u.id
    ORDER BY application_count DESC
    LIMIT $1
  `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

export default ApplicationsRepository;
