import { IJobTagsRepository, IJobAdsRepository, ITagsRepository } from '../types/repositories';
import { NotFoundException } from '../exceptions/not-found-exception';
import { AddJobTagDTO, JobTag } from '../types/dataTypes/jobTagData';
import { ErrorCode } from '../types/errorCodes';
import { ConflictException } from '../exceptions/conflict-exception';

class JobTagsServices {
  private jobTagsRepository: IJobTagsRepository;
  private jobAdsRepository: IJobAdsRepository;
  private tagsRepository: ITagsRepository;

  constructor(
    jobTagsRepository: IJobTagsRepository,
    jobAdsRepository: IJobAdsRepository,
    tagsRepository: ITagsRepository
  ) {
    this.jobTagsRepository = jobTagsRepository;
    this.jobAdsRepository = jobAdsRepository;
    this.tagsRepository = tagsRepository;
  }

  async addJobTags(jobAdId: number, data: AddJobTagDTO): Promise<void> {
    const foundJobAd = await this.jobAdsRepository.findJobAd(jobAdId);
    if (!foundJobAd)
      throw new NotFoundException('JobAd not found', ErrorCode.NOT_FOUND_JOBAD_EXCEPTION);

    const newTagIds: number[] = [];

    if (typeof data.tags[0] === 'number') {
      for (const tagId of data.tags as number[]) {
        const foundTag = await this.tagsRepository.findTag(tagId);
        if (!foundTag) {
          throw new NotFoundException(
            `Tag with ID ${tagId} not found`,
            ErrorCode.NOT_FOUND_TAG_EXCEPTION
          );
        }
        newTagIds.push(tagId);
      }
    } else {
      for (const tagName of data.tags as string[]) {
        let foundTag = await this.tagsRepository.findTag(tagName.toLowerCase());
        if (!foundTag) {
          foundTag = await this.tagsRepository.addTag(tagName.toLowerCase());
        }
        newTagIds.push(foundTag.id);
      }
    }
       for (const tagId of newTagIds) {
        const foundJobTag = await this.jobTagsRepository.findJobTag(jobAdId,tagId)
        if (foundJobTag) {
          throw new ConflictException(
            `Tag with ID ${tagId} already exists in this jobAd`,
            ErrorCode.CONFLICT_EXCEPTION
          );
        }}
    await this.jobTagsRepository.addJobTag(jobAdId, newTagIds);
  }

  async getAllJobTags(): Promise<JobTag[]> {
    return this.jobTagsRepository.listJobTags();
  }
  async getFullJobTag(jobAdId: number): Promise<any> {
    return this.jobTagsRepository.getFullJobTag(jobAdId);
  }
  async getAllJobAdsWithTags(): Promise<any[]> {
  return this.jobTagsRepository.listFullJobAdsWithTags();
}


  async deleteJobTag(loggedUserId:number,jobAdId: number, tagId: number): Promise<void> {
    const isOwner = await this.jobAdsRepository.jobAdOwnershipCheck(loggedUserId,jobAdId)
   if (!isOwner)
      throw new NotFoundException(
        "The jobAd either doesn't exist or isn't owned by the user",
        ErrorCode.NOT_FOUND_JOBAD_EXCEPTION
      );
      const foundTag = await this.jobTagsRepository.findJobTag(jobAdId,tagId)
      if (!foundTag)
      throw new NotFoundException(
        "The jobTag doesn't exist for this jobAd.",
        ErrorCode.NOT_FOUND_JOBTAG_EXCEPTION
      );
    await this.jobTagsRepository.hardDeleteJobTag(jobAdId, tagId);
  }

}

export default JobTagsServices;
