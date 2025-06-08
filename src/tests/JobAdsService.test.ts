import JobAdsServices from '../services/JobAdsService';
import { NotFoundException } from '../exceptions/not-found-exception';
import { ErrorCode } from '../types/errorCodes';
import {
  CreateJobAdDTO,
  FullJobAdDTO,
  JobAd,
  JobType,
  MappedJobAd,
  NormalizedJobAdData,
  UpdateJobAdDTO,
  XPLVL,
} from '../types/dataTypes/jobAdData';
import { IJobAdsRepository, IJobTagsRepository } from '../types/repositories';
import { normalizeCreateJobAdDTO, normalizeUpdateJobAdDTO } from '../utils/normalizationUtils';
import { tagsChecker } from '../utils/tagUtils';

jest.mock('../utils/normalizationUtils', () => ({
  normalizeCreateJobAdDTO: jest.fn(),
  normalizeUpdateJobAdDTO: jest.fn(),
}));
jest.mock('../utils/tagUtils', () => ({
  tagsChecker: jest.fn(),
}));

describe('JobAdsServices', () => {
  let jobAdsRepository: jest.Mocked<IJobAdsRepository>;
  let jobTagsRepository: jest.Mocked<IJobTagsRepository>;
  let companiesRepository: any;
  let service: JobAdsServices;

  const jobAdInput: CreateJobAdDTO = {
    title: 'Remote Data Analyst',
    description: 'Analyze datasets and generate actionable insights. Remote work allowed.',
    salary_min: 45000,
    salary_max: 65000,
    type: JobType.PARTTIME,
    experience_level: XPLVL.MID,
    company_id: 1,
    tags: ['js', 'node'],
  };
  const normalizedJobAdInput: NormalizedJobAdData = {
    title: 'remote data analyst',
    description: 'analyze datasets and generate actionable insights. remote work allowed.',
    salary_min: 45000,
    salary_max: 65000,
    type: JobType.PARTTIME,
    experience_level: XPLVL.MID,
    company_id: 1,
  };

  const fakeJobAds: JobAd[] = [
    {
      id: 1,
      employer_id: 1,
      title: 'remote data analyst',
      description: 'analyze datasets and generate actionable insights. remote work allowed.',
      salary_min: 45000,
      salary_max: 65000,
      type: JobType.PARTTIME,
      experience_level: XPLVL.MID,
      company_id: 1,
      city_id: 1,
      created_at: new Date('2024-01-01'),
      deleted_at: null as unknown as Date,
    },
    {
      id: 2,
      employer_id: 2,
      title: 'frontend developer',
      description: 'work on modern frontend apps',
      salary_min: 55000,
      salary_max: 70000,
      type: JobType.FULLTIME,
      experience_level: XPLVL.SENIOR,
      company_id: 2,
      city_id: 2,
      created_at: new Date('2024-02-01'),
      deleted_at: null as unknown as Date,
    },
  ];

  const fakeMappedJobAds: MappedJobAd[] = [
    {
      id: 1,
      title: 'remote data analyst',
      description: 'analyze datasets and generate actionable insights. remote work allowed.',
      salary_min: 45000,
      salary_max: 65000,
      type: JobType.PARTTIME,
      experience_level: XPLVL.MID,
      created_at: new Date('2024-01-01'),
      deleted_at: null as unknown as Date,
      employer: {
        id: 1,
        name: 'john doe',
      },
      company: {
        id: 1,
        name: 'test Company',
      },
      city: {
        id: 1,
        name: 'paris',
      },
      tags: ['js', 'node'],
    },
    {
      id: 2,
      title: 'frontend developer',
      description: 'work on modern frontend apps',
      salary_min: 55000,
      salary_max: 70000,
      type: JobType.FULLTIME,
      experience_level: XPLVL.SENIOR,
      created_at: new Date('2024-02-01'),
      deleted_at: null as unknown as Date,
      employer: {
        id: 2,
        name: 'alice van',
      },
      company: {
        id: 2,
        name: 'awesome corp',
      },
      city: {
        id: 2,
        name: 'lyon',
      },
      tags: ['react', 'typescript'],
    },
  ];

  beforeEach(() => {
    jobAdsRepository = {
      createJobAd: jest.fn(),
      getFullJobAdById: jest.fn(),
      listJobAds: jest.fn(),
      listAllJobAds: jest.fn(),
      findJobAd: jest.fn(),
      updateJobAd: jest.fn(),
      softDeleteJobAd: jest.fn(),
      jobAdOwnershipCheck: jest.fn(),
      getTopJobAdsByApplications: jest.fn(),
    };

    jobTagsRepository = {
      addJobTag: jest.fn(),
      updateJobTags: jest.fn(),
      listJobTags: jest.fn(),
      hardDeleteJobTag: jest.fn(),
    };

    companiesRepository = {
      companyOwnershipCheck: jest.fn(),
    };

    service = new JobAdsServices(jobAdsRepository, jobTagsRepository, companiesRepository);
    jest.clearAllMocks();
  });

  describe('createJobAd', () => {
    it('should create a job ad and associate tags', async () => {
      (normalizeCreateJobAdDTO as jest.Mock).mockReturnValue(normalizedJobAdInput);
      companiesRepository.companyOwnershipCheck.mockResolvedValue(true);
      jobAdsRepository.createJobAd.mockResolvedValue(fakeJobAds[0]);
      (tagsChecker as jest.Mock).mockResolvedValue([1, 2]);
      jobTagsRepository.addJobTag.mockResolvedValue(undefined);
      jobAdsRepository.getFullJobAdById.mockResolvedValue(fakeMappedJobAds[0]);

      const result = await service.createJobAd(1, jobAdInput);

      expect(normalizeCreateJobAdDTO).toHaveBeenCalledWith(jobAdInput);
      expect(companiesRepository.companyOwnershipCheck).toHaveBeenCalledWith(1, 1);
      expect(jobAdsRepository.createJobAd).toHaveBeenCalledWith(1, normalizedJobAdInput);
      expect(tagsChecker).toHaveBeenCalledWith(['js', 'node']);
      expect(jobTagsRepository.addJobTag).toHaveBeenCalledWith(1, [1, 2]);
      expect(jobAdsRepository.getFullJobAdById).toHaveBeenCalledWith(1);
      expect(result).toEqual(fakeMappedJobAds[0]);
    });

    it('should throw if user doesn’t own the company', async () => {
      (normalizeCreateJobAdDTO as jest.Mock).mockReturnValue({
        ...normalizedJobAdInput,
        company_id: 99,
      });
      companiesRepository.companyOwnershipCheck.mockResolvedValue(false);

      await expect(service.createJobAd(1, { ...jobAdInput, company_id: 99 })).rejects.toThrow(
        NotFoundException
      );
      expect(normalizeCreateJobAdDTO).toHaveBeenCalledWith({ ...jobAdInput, company_id: 99 });
      expect(companiesRepository.companyOwnershipCheck).toHaveBeenCalledWith(1, 99);
    });
  });

  describe('getUserJobAds', () => {
    it('should return full job ads', async () => {
      jobAdsRepository.listJobAds.mockResolvedValue([fakeJobAds[0]]);
      jobAdsRepository.getFullJobAdById.mockResolvedValueOnce(fakeMappedJobAds[0]);

      const result = await service.getUserJobAds(1);

      expect(jobAdsRepository.listJobAds).toHaveBeenCalledWith(1);
      expect(jobAdsRepository.getFullJobAdById).toHaveBeenCalledWith(1);

      expect(result).toEqual([fakeMappedJobAds[0]]);
    });
  });

  describe('getJobAds', () => {
    it('should return all full job ads', async () => {
      jobAdsRepository.listAllJobAds.mockResolvedValue(fakeJobAds);
      jobAdsRepository.getFullJobAdById
        .mockResolvedValueOnce(fakeMappedJobAds[0])
        .mockResolvedValueOnce(fakeMappedJobAds[1]);
      const result = await service.getJobAds();

      expect(jobAdsRepository.listAllJobAds).toHaveBeenCalled();
      expect(jobAdsRepository.getFullJobAdById).toHaveBeenCalledWith(1);
      expect(jobAdsRepository.getFullJobAdById).toHaveBeenCalledWith(2);
      expect(result).toEqual(fakeMappedJobAds);
    });
  });

  describe('updateJobAd', () => {
    const updateInput: UpdateJobAdDTO = { tags: ['ts'], title: 'updated' };
    const updatedJobAd: JobAd = {
      ...fakeJobAds[0],
      title: 'updated',
    };

    const normalizedUpdateInput: NormalizedJobAdData = { title: 'updated' };
    it('should update job ad and tags', async () => {
      jobAdsRepository.jobAdOwnershipCheck.mockResolvedValue(true);
      jobAdsRepository.findJobAd.mockResolvedValue(fakeJobAds[0]);
      (tagsChecker as jest.Mock).mockResolvedValue([5]);
      jobTagsRepository.updateJobTags.mockResolvedValue(undefined);
      (normalizeUpdateJobAdDTO as jest.Mock).mockReturnValue(normalizedUpdateInput);
      jobAdsRepository.updateJobAd.mockResolvedValue(updatedJobAd);

      const result = await service.updateJobAd(1, 1, updateInput);

      expect(jobAdsRepository.jobAdOwnershipCheck).toHaveBeenCalledWith(1, 1);
      expect(jobAdsRepository.findJobAd).toHaveBeenCalledWith(1);
      expect(tagsChecker).toHaveBeenCalledWith(['ts']);
      expect(jobTagsRepository.updateJobTags).toHaveBeenCalledWith(1, [5]);
      expect(normalizeUpdateJobAdDTO).toHaveBeenCalledWith(updateInput);
      expect(jobAdsRepository.updateJobAd).toHaveBeenCalledWith(1, normalizedUpdateInput);
      expect(result).toEqual(updatedJobAd);
    });

    it('should throw if not found', async () => {
      jobAdsRepository.findJobAd.mockResolvedValue(null);

      await expect(service.updateJobAd(1, 99, updateInput)).rejects.toThrow(NotFoundException);
      expect(jobAdsRepository.findJobAd).toHaveBeenCalledWith(99);
    });

    it('should throw if not owner', async () => {
      jobAdsRepository.findJobAd.mockResolvedValue(fakeJobAds[1]);

      jobAdsRepository.jobAdOwnershipCheck.mockResolvedValue(false);

      await expect(service.updateJobAd(1, 2, updateInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteJobAd', () => {
    const deletedJobAd: JobAd = {
      ...fakeJobAds[0],
      deleted_at: new Date(),
    };
    it('should soft delete job ad if owner', async () => {
      jobAdsRepository.jobAdOwnershipCheck.mockResolvedValue(true);
      jobAdsRepository.softDeleteJobAd.mockResolvedValue(deletedJobAd);

      const result = await service.deleteJobAd(1, 1);

      expect(jobAdsRepository.jobAdOwnershipCheck).toHaveBeenCalledWith(1, 1);
      expect(jobAdsRepository.softDeleteJobAd).toHaveBeenCalledWith(1);
      expect(result).toEqual(deletedJobAd);
    });

    it('should throw if not owner', async () => {
      jobAdsRepository.jobAdOwnershipCheck.mockResolvedValue(false);
      await expect(service.deleteJobAd(1, 2)).rejects.toThrow(NotFoundException);
      expect(jobAdsRepository.jobAdOwnershipCheck).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('getTopJobAds', () => {
    it('should return top ads', async () => {
      jobAdsRepository.getTopJobAdsByApplications.mockResolvedValue(fakeJobAds);

      const result = await service.getTopJobAds();

      expect(jobAdsRepository.getTopJobAdsByApplications).toHaveBeenCalledWith(2);
      expect(result).toEqual(fakeJobAds);
    });
  });
});
