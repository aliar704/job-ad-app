import { FullApplicationDTO } from '../types/dataTypes/applicationData';
import { FullCompanyDTO, MappedCompany } from '../types/dataTypes/companyData';
import { ApplicantInfo, FullJobAdDTO, JobAdApplicationsDTO, MappedJobAd } from '../types/dataTypes/jobAdData';

export function mapCompanyRow(row: FullCompanyDTO): MappedCompany {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    website: row.website,
    phone: row.phone,
    address: row.address,
    created_at: row.created_at,
    deleted_at: row.deleted_at,
    employer: {
      id: row.employer_id,
      name: row.employer_name,
    },
    city: {
      id: row.city_id,
      name: row.city_name,
    },
  };
}

export function mapFullJobAdRow(row: FullJobAdDTO): MappedJobAd {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    salary_min: row.salary_min,
    salary_max: row.salary_max,
    type: row.type,
    experience_level: row.experience_level,
    created_at: row.created_at,
    deleted_at: row.deleted_at,
    employer: {
      id: row.employer_id,
      name: row.employer_name,
    },
    company: {
      id: row.company_id,
      name: row.company_name,
    },
    city: {
      id: row.city_id,
      name: row.city_name,
    },
    tags: row.tags || [],
  };
}
export function mapJobAdApplications(rows: any[]): JobAdApplicationsDTO | null{
  if (rows.length === 0) return null;

  const applicants: ApplicantInfo[] = rows.map((row) => ({
    application_id: row.application_id,
    jobseeker_id: row.jobseeker_id,
    full_name: row.full_name,
    status: row.status,
    resume: {
      id: row.resume_id,
      title: row.resume_title,
      content: row.resume_content,
      file_url: row.resume_file_url,
    },
  }));

  return {
    id: rows[0].id,
    title: rows[0].title,
    description: rows[0].description,
    salary_min: rows[0].salary_min,
    salary_max: rows[0].salary_max,
    type: rows[0].type,
    experience_level: rows[0].experience_level,
    created_at: rows[0].created_at,
    application_count: parseInt(rows[0].application_count), // optional: cast count to number
    applicants,
  };
}
export function mapUserApplications(rows: any[]): FullApplicationDTO[] {
  return rows.map((row) => ({
    id: row.application_id,
    status: row.status,
    applied_at: row.applied_at,
    resume: {
      id: row.resume_id,
      title: row.resume_title,
      content: row.resume_content,
      file_url: row.resume_file_url,
    },
    job_ad: {
      id: row.jobad_id,
      title: row.jobad_title,
      description: row.jobad_description,
      salary_min: row.salary_min,
      salary_max: row.salary_max,
      type: row.jobad_type,
      experience_level: row.jobad_experience_level,
      created_at: row.jobad_created_at,
    },
    company: {
      id: row.company_id,
      name: row.company_name,
      description: row.company_description,
      website: row.website,
      phone: row.phone,
      city_id: row.company_city_id,
      address: row.company_address,
      created_at: row.company_created_at,
    },
  }));
}