import { IJobAdsRepository, IJobTagsRepository, ICompaniesRepository } from '../types/repositories';
import { NotFoundException } from '../exceptions/not-found-exception';
import { tagsChecker } from '../utils/tagUtils';
import _ from 'lodash';
import { CreateJobAdDTO, JobAd, JobAdApplicationsDTO, MappedJobAd, UpdateJobAdDTO } from '../types/dataTypes/jobAdData';
import { ErrorCode } from '../types/errorCodes';
import { normalizeCreateJobAdDTO, normalizeUpdateJobAdDTO } from '../utils/normalizationUtils';
import { mapJobAdApplications } from '../utils/rowMapper';

class JobAdsServices {
  private jobAdsRepository: IJobAdsRepository;
  private jobTagsRepository: IJobTagsRepository;
  private companiesRepository: ICompaniesRepository;

  constructor(
    jobAdsRepository: IJobAdsRepository,
    jobTagsRepository: IJobTagsRepository,
    companiesRepository: ICompaniesRepository
  ) {
    this.jobAdsRepository = jobAdsRepository;
    this.jobTagsRepository = jobTagsRepository;
    this.companiesRepository = companiesRepository;
  }

  async createJobAd(loggedUserId: number, data: CreateJobAdDTO): Promise<MappedJobAd> {
    const normalizedData = normalizeCreateJobAdDTO(data);

    const isOwner = await this.companiesRepository.companyOwnershipCheck(
      loggedUserId,
      normalizedData.company_id!
    );
    if (!isOwner)
      throw new NotFoundException(
        "The company either doesn't exist or isn't owned by the user",
        ErrorCode.NOT_FOUND_COMPANY_EXCEPTION
      );

    const jobAd = await this.jobAdsRepository.createJobAd(loggedUserId, normalizedData);

    if (data.tags) {
      const tagIds = await tagsChecker(data.tags);
      await this.jobTagsRepository.addJobTag(jobAd.id, tagIds);
    }

    return await this.jobAdsRepository.getFullJobAdById(jobAd.id);
  }

  async getUserJobAds(loggedUserId: number): Promise<MappedJobAd[]> {
    const jobAds = await this.jobAdsRepository.listJobAds(loggedUserId);
    const fullJobAds = await Promise.all(
      jobAds.map((jobAd) => this.jobAdsRepository.getFullJobAdById(jobAd.id))
    );
    return fullJobAds;
  }

  async getJobAds(): Promise<MappedJobAd[]> {
    const jobAds = await this.jobAdsRepository.listAllJobAds();
    const fullJobAds = await Promise.all(
      jobAds.map((jobAd) => this.jobAdsRepository.getFullJobAdById(jobAd.id))
    );
    return fullJobAds;
  }
  async getJobAdApplications(jobAdId: number): Promise<JobAdApplicationsDTO | null> {
  const rows = await this.jobAdsRepository.getJobAdApplications(jobAdId);
  return mapJobAdApplications(rows);
}

  async updateJobAd(loggedUserId: number, jobAdId: number, data: UpdateJobAdDTO): Promise<JobAd> {
    const foundJobAd = await this.jobAdsRepository.findJobAd(jobAdId);
    if (!foundJobAd)
      throw new NotFoundException('JobAd not found', ErrorCode.NOT_FOUND_JOBAD_EXCEPTION);
    const isOwner = await this.jobAdsRepository.jobAdOwnershipCheck(loggedUserId,jobAdId );
    if (!isOwner)
      throw new NotFoundException(
        "The job ad either doesn't exist or isn't owned by the user",
        ErrorCode.NOT_FOUND_JOBAD_EXCEPTION
      );

    if (data.tags) {
      const tagIds = await tagsChecker(data.tags);
      await this.jobTagsRepository.updateJobTags(foundJobAd.id, tagIds);
    }
    const normalizedData = normalizeUpdateJobAdDTO(data);
    const updatedJobAd = await this.jobAdsRepository.updateJobAd(jobAdId, normalizedData);

    return updatedJobAd;
  }

  async deleteJobAd(loggedUserId: number, jobAdId: number): Promise<JobAd> {
    const isOwner = await this.jobAdsRepository.jobAdOwnershipCheck(loggedUserId, jobAdId);
    if (!isOwner)
      throw new NotFoundException(
        "The job ad either doesn't exist or isn't owned by the user",
        ErrorCode.NOT_FOUND_JOBAD_EXCEPTION
      );

    return await this.jobAdsRepository.softDeleteJobAd(jobAdId);
  }

  async getTopJobAds(): Promise<JobAd[]> {
    return this.jobAdsRepository.getTopJobAdsByApplications(2);
  }
}

export default JobAdsServices;
