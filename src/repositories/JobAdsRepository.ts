import pool from '../db/postgres';
import { JobAd, MappedJobAd, NormalizedJobAdData } from '../types/dataTypes/jobAdData';
import { IJobAdsRepository } from '../types/repositories/IJobAdsRepository';
import { mapFullJobAdRow } from '../utils/rowMapper';
import CompaniesRepository from './CompaniesRepository';
const companiesRepository = new CompaniesRepository();

class JobAdsRepository implements IJobAdsRepository {
  constructor() {}

  async findJobAd(jobAdId: number): Promise<JobAd | null> {
    const query = `SELECT * FROM job_ads WHERE id = $1 AND deleted_at IS NULL`;
    const values = [jobAdId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async jobAdOwnershipCheck(loggedUserId: number, jobAdId: number): Promise<boolean> {
    const query = `SELECT 1 FROM job_ads WHERE id = $1 AND employer_id = $2 AND deleted_at IS NULL LIMIT 1`;
    const values = [jobAdId, loggedUserId];
    const result = await pool.query(query, values);
    return result.rowCount! > 0;
  }

  async createJobAd(loggedUserId: number, data: NormalizedJobAdData): Promise<JobAd> {
    const cityId = await companiesRepository.findCityIdByCompanyId(data.company_id!);
    const query = `INSERT INTO job_ads (employer_id,title,description,salary_min,salary_max,type,experience_level,company_id,city_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
    const values = [
      loggedUserId,
      data.title,
      data.description,
      data.salary_min,
      data.salary_max,
      data.type,
      data.experience_level,
      data.company_id,
      cityId,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async listJobAds(loggedUserId: number): Promise<JobAd[]> {
    const query = `SELECT * FROM job_ads WHERE employer_id=$1 AND deleted_at IS NULL `;
    const values = [loggedUserId];
    const result = await pool.query(query, values);
    return result.rows;
  }
  async listAllJobAds(): Promise<JobAd[]> {
    const query = `SELECT * FROM job_ads WHERE deleted_at IS NULL `;
    const result = await pool.query(query);
    return result.rows;
  }
  async updateJobAd(JobAdId: number, data: NormalizedJobAdData): Promise<JobAd> {
    const updateFields: string[] = [];
    const values: (number | string)[] = [];
    let index = 1;
    for (const key in data) {
      const typedKey = key as keyof NormalizedJobAdData;
      if (data[typedKey] !== undefined) {
        updateFields.push(`${typedKey}=$${index++}`);
        values.push(data[typedKey] as string | number);
      }
    }
    values.push(JobAdId);
    const query = `UPDATE job_ads SET ${updateFields.join(
      ', '
    )} WHERE id = $${index} AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async softDeleteJobAd(JobAdId: number): Promise<JobAd> {
    const query = `UPDATE job_ads SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, [JobAdId]);
    return result.rows[0];
  }

  async getFullJobAdById(jobAdId: number): Promise<MappedJobAd> {
    const query = `
    SELECT 
      ja.*,
      ci.name AS city_name,
      c.name AS company_name,
      u.full_name AS employer_name,
      COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags
    FROM job_ads ja
    JOIN cities ci ON ja.city_id = ci.id
    JOIN companies c ON ja.company_id = c.id
    JOIN users u ON ja.employer_id = u.id
    LEFT JOIN job_tags jt ON ja.id = jt.job_ad_id
    LEFT JOIN tags t ON jt.tag_id = t.id
    WHERE ja.id = $1 AND ja.deleted_at IS NULL
    GROUP BY ja.id, ci.name, c.name, u.full_name
  `;

    const result = await pool.query(query, [jobAdId]);

    return mapFullJobAdRow(result.rows[0]);
  }
  async getTopJobAdsByApplications(limit: number = 2): Promise<JobAd[]> {
    const query = `
    SELECT ja.*, COUNT(a.id) AS application_count
    FROM job_ads ja
    LEFT JOIN applications a ON ja.id = a.job_ad_id
    WHERE ja.deleted_at IS NULL
    GROUP BY ja.id
    ORDER BY application_count DESC
    LIMIT $1
  `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
  async getJobAdApplications(jobAdId: number): Promise<any[]> {
  const query = `
    SELECT 
      ja.*,
      a.id AS application_id, a.jobseeker_id, a.status,
      u.full_name,
      r.id AS resume_id, r.title AS resume_title, r.content AS resume_content, r.file_url AS resume_file_url,
      COUNT(a.id) OVER() AS application_count
    FROM job_ads ja
    JOIN applications a ON ja.id = a.job_ad_id
    LEFT JOIN users u ON a.jobseeker_id = u.id
    LEFT JOIN resumes r ON a.resume_id = r.id
    WHERE ja.id = $1 AND ja.deleted_at IS NULL
  `;
  const result = await pool.query(query, [jobAdId]);
  return result.rows;
}
}

export default JobAdsRepository;
