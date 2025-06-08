import { JobTag } from '../dataTypes/jobTagData';

export interface IJobTagsRepository {
  findJobTag(jobAdId: number, tagId: number): Promise<JobTag | null>
  addJobTag(jobAdId: number, tagIds: number[]): Promise<void>;
  updateJobTags(jobAdId: number, tagIds: number[]): Promise<void>;
  listJobTags(): Promise<JobTag[]>;
  hardDeleteJobTag(jobAdId: number, tagId: number): Promise<void>;
  jobTagOwnershipCheck(loggedUserId: number, jobAdId: number): Promise<boolean>;
}
