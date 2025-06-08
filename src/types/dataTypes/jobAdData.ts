export interface CreateJobAdDTO {
  title: string;
  description: string;
  salary_min?: number | null;
  salary_max?: number | null;
  type: JobType;
  experience_level: XPLVL;
  company_id: number;
  tags?: string[] | number[] | null;
}
export interface UpdateJobAdDTO {
  title?: string;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  type?: JobType;
  experience_level?: XPLVL;
  company_id?: number;
  tags?: string[];
}
export interface JobAd {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  salary_min: number;
  salary_max: number;
  type: JobType;
  experience_level: XPLVL;
  company_id: number;
  city_id: number;
  created_at: Date;
  deleted_at: Date;
}
export interface MappedJobAd {
  id: number;
  title: string;
  description: string;
  salary_min: number;
  salary_max: number;
  type: JobType;
  experience_level: XPLVL;
  created_at: Date;
  deleted_at: Date;
  employer: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  tags: string[];
}
export interface NormalizedJobAdData {
  title?: string;
  description?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  type?: JobType;
  experience_level?: XPLVL;
  company_id?: number;
}
export interface FullJobAdDTO extends JobAd {
  city_name: string;
  company_name: string;
  employer_name: string;
  tags: string[];
}

export enum JobType {
  FULLTIME = 'full-time',
  PARTTIME = 'part-time',
  REMOTE = 'remote',
}

export enum XPLVL {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
}

export interface ResumeInfo {
  id: number;
  title: string;
  content: string;
  file_url: string;
}

export interface ApplicantInfo {
  application_id: number;
  jobseeker_id: number;
  full_name: string;
  resume: ResumeInfo;
  status: string; // or STATUS enum if consistent
}

export interface JobAdApplicationsDTO {
  id: number;
  title: string;
  description: string;
  salary_min: number;
  salary_max: number;
  type: JobType;
  experience_level: XPLVL;
  created_at: Date;
  application_count: number;
  applicants: ApplicantInfo[];
}
