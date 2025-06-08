import { Company } from "./companyData";
import { JobAd, JobType, XPLVL } from "./jobAdData";
import { Resume } from "./resumeData";

export interface CreateApplicationDTO {
  job_ad_id: number;
  resume_id: number;
}
export interface Application {
  id: number;
  jobseekr_id: number;
  job_ad_id: number;
  resume_id: number;
  status: STATUS;
  applied_at: Date;
}
export enum STATUS {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}
export interface ChangeApplicationStatusDTO {
  status: STATUS;
}


export interface ResumeDTO {
  id: number;
  title: string;
  content: string;
  file_url: string;
}

export interface CompanyDTO {
  id: number;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  city_id: number;
  address?: string;
  created_at: Date;
}

export interface JobAdDTO {
  id: number;
  title: string;
  description: string;
  salary_min: number;
  salary_max: number;
  type: JobType;
  experience_level: XPLVL;
  created_at: Date;
}

export interface FullApplicationDTO {
  id: number;
  status: STATUS;
  applied_at: Date;
  resume: ResumeDTO;
  job_ad: JobAdDTO;
  company: CompanyDTO;
}
