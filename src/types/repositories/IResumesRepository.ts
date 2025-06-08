import { CreateResumeDTO, Resume, UpdateResumeDTO } from "../dataTypes/resumeData";

export interface IResumesRepository {
  addResume(loggedUserId: number, data: CreateResumeDTO): Promise<Resume>;
  listLoggedUserResumes(loggedUserId: number): Promise<Resume[]>;
  resumeOwnershipCheck(loggedUserId: number, resumeId: number): Promise<boolean>;
  findResume(resumeId: number): Promise<Resume | null>;
  updateResume(resumeId: number, data: UpdateResumeDTO): Promise<Resume>;
  softDeleteResume(resumeId: number): Promise<Resume>;
}
