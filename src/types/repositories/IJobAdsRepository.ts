import {
  CreateJobAdDTO,
  FullJobAdDTO,
  JobAd,
  MappedJobAd,
  NormalizedJobAdData,
  UpdateJobAdDTO,
} from '../dataTypes/jobAdData';

export interface IJobAdsRepository {
  findJobAd(jobAdId: number): Promise<JobAd | null>;
  jobAdOwnershipCheck(loggedUserId: number, jobAdId: number): Promise<boolean>;
  createJobAd(loggedUserId: number, data: NormalizedJobAdData): Promise<JobAd>;
  listJobAds(loggedUserId: number): Promise<JobAd[]>;
  getJobAdApplications(jobAdId:number): Promise<any[]>
  listAllJobAds(): Promise<JobAd[]>;
  updateJobAd(jobAdId: number, data: NormalizedJobAdData): Promise<JobAd>;
  softDeleteJobAd(jobAdId: number): Promise<JobAd>;
  getFullJobAdById(jobAdId: number): Promise<MappedJobAd>;
  getTopJobAdsByApplications(limit?: number): Promise<JobAd[]>;
  
}
