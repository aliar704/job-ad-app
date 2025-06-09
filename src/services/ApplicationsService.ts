import {
  IResumesRepository,
  IApplicationsRepository,
  IJobAdsRepository,
} from '../types/repositories';
import { NotFoundException } from '../exceptions/not-found-exception';
import { getOrSetCache } from '../cache/cacheUtils';
import { RedisKeys } from '../types/redisKeys';
import {
  Application,
  ChangeApplicationStatusDTO,
  CreateApplicationDTO,
  FullApplicationDTO,
  STATUS,
} from '../types/dataTypes/applicationData';
import { ErrorCode } from '../types/errorCodes';
import { ConflictException } from '../exceptions/conflict-exception';
import { mapUserApplications } from '../utils/rowMapper';

class ApplicationsServices {
  private resumesRepository: IResumesRepository;
  private applicationsRepository: IApplicationsRepository;
  private jobAdsRepository: IJobAdsRepository;

  constructor(
    resumesRepository: IResumesRepository,
    applicationsRepository: IApplicationsRepository,
    jobAdsRepository: IJobAdsRepository
  ) {
    this.resumesRepository = resumesRepository;
    this.applicationsRepository = applicationsRepository;
    this.jobAdsRepository = jobAdsRepository;
  }

  async createApplication(loggedUserId: number, data: CreateApplicationDTO): Promise<Application> {
    const isOwner = await this.resumesRepository.resumeOwnershipCheck(loggedUserId, data.resume_id);
    if (!isOwner)
      throw new NotFoundException(
        'Resume not found or access denied',
        ErrorCode.NOT_FOUND_RESUME_EXCEPTION
      );

    const foundJobAd = await this.jobAdsRepository.findJobAd(data.job_ad_id);
    if (!foundJobAd)
      throw new NotFoundException('JobAd not found!', ErrorCode.NOT_FOUND_JOBAD_EXCEPTION);
    const foundApplication = await this.applicationsRepository.isAlreadyApplied(
      loggedUserId,
      data.job_ad_id
    );
    if (foundApplication) {
      throw new ConflictException(
        'You already applied for this jobAd',
        ErrorCode.CONFLICT_EXCEPTION
      );
    }

    return this.applicationsRepository.createApplication(loggedUserId, data);
  }

  async getUserApplications(loggedUserId: number): Promise<Application[]> {
    return this.applicationsRepository.listApplications(loggedUserId);
  }

  async cancelApplication(loggedUserId: number, applicationId: number): Promise<Application> {
    const isOwner = await this.applicationsRepository.applicationOwnershipCheck(
      loggedUserId,
      applicationId
    );
    if (!isOwner)
      throw new NotFoundException(
        'Application not found or access denied',
        ErrorCode.NOT_FOUND_APPLICATION_EXCEPTION
      );

    return this.applicationsRepository.cancelApplication(applicationId);
  }
  async changeApplicationStatus(
    inputStatus: ChangeApplicationStatusDTO,
    applicationId: number
  ): Promise<Application> {
    const foundApplization = await this.applicationsRepository.findApplication(applicationId);
    if (!foundApplization) {
      throw new NotFoundException(
        'Could not find application',
        ErrorCode.NOT_FOUND_APPLICATION_EXCEPTION
      );
    }

    return this.applicationsRepository.changeApplicationStatus(applicationId, inputStatus.status);
  }
  async getAllApplicationsInfo(userId: number): Promise<FullApplicationDTO[]> {
    const rawApps = await this.applicationsRepository.listAllApplicationsInfo(userId);
    return mapUserApplications(rawApps);
  }
  async getTopJobSeekers(): Promise<any[]> {
    return getOrSetCache(
      RedisKeys.TOP_JOB_SEEKERS,
      () => this.applicationsRepository.getTopJobSeekersByApplications(3),
      300
    );
  }
}

export default ApplicationsServices;
