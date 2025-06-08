import pool from '../db/postgres';
import { JobAd } from '../types/dataTypes/jobAdData';
import { SearchJobAdsDTO } from '../types/dataTypes/searchData';
import { ISearchRepository } from '../types/repositories/ISearchRepository';

class SearchRepository implements ISearchRepository {
  constructor() {}

  async searchJobAds(filters: SearchJobAdsDTO): Promise<JobAd[]> {
    const { title, company, city, tags } = filters;

    const conditions: string[] = [];
    const values: (string | number | string[])[] = [];
    let idx = 1;

    if (title) {
      conditions.push(`ja.title ILIKE '%' || $${idx++} || '%'`);
      values.push(title);
    }

    if (company) {
      conditions.push(`c.name ILIKE '%' || $${idx++} || '%'`);
      values.push(company);
    }

    if (city) {
      conditions.push(`ci.name ILIKE '%' || $${idx++} || '%'`);
      values.push(city);
    }

    if (tags && tags.length > 0) {
      conditions.push(`t.name = ANY($${idx++})`);
      values.push(tags);
    }

    const whereClause = `WHERE ${[
      ...(conditions.length > 0 ? conditions : []),
      'ja.deleted_at IS NULL',
    ].join(' AND ')}`;

    const query = `
  SELECT DISTINCT ja.*
  FROM job_ads ja
  LEFT JOIN companies c ON ja.company_id = c.id
  LEFT JOIN cities ci ON ja.city_id = ci.id
  LEFT JOIN job_tags jt ON ja.id = jt.job_ad_id
  LEFT JOIN tags t ON jt.tag_id = t.id
  ${whereClause}
`;

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default SearchRepository;
