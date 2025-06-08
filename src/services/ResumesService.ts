import { NotFoundException } from '../exceptions/not-found-exception';
import { CreateResumeDTO, Resume, UpdateResumeDTO } from '../types/dataTypes/resumeData';
import { ErrorCode } from '../types/errorCodes';
import { IResumesRepository } from '../types/repositories';
import { normalizeCreateResumeDTO, normalizeUpdateResumeDTO } from '../utils/normalizationUtils';

class ResumesServices {
  private resumesRepository: IResumesRepository;

  constructor(resumesRepository: IResumesRepository) {
    this.resumesRepository = resumesRepository;
  }

  async createResume(loggedUserId: number, data: CreateResumeDTO): Promise<Resume> {
    const normalizedData = normalizeCreateResumeDTO(data)
    return await this.resumesRepository.addResume(loggedUserId, normalizedData);
  }

  async getUserResumes(loggedUserId: number): Promise<Resume[]> {
    return await this.resumesRepository.listLoggedUserResumes(loggedUserId);
  }

  async updateResume(
    loggedUserId: number,
    resumeId: number,
    data: UpdateResumeDTO
  ): Promise<Resume> {
    const isOwner = await this.resumesRepository.resumeOwnershipCheck(loggedUserId, resumeId);
    if (!isOwner)
      throw new NotFoundException(
        "The resume either doesn't exist or isn't owned by the user",
        ErrorCode.NOT_FOUND_RESUME_EXCEPTION
      );
      const normalizedData = normalizeUpdateResumeDTO(data)

    return await this.resumesRepository.updateResume(resumeId, normalizedData);
  }

  async deleteResume(loggedUserId: number, resumeId: number): Promise<Resume> {
    const isOwner = await this.resumesRepository.resumeOwnershipCheck(loggedUserId, resumeId);
    if (!isOwner)
      throw new NotFoundException(
        "The resume either doesn't exist or isn't owned by the user",
        ErrorCode.NOT_FOUND_RESUME_EXCEPTION
      );

    return await this.resumesRepository.softDeleteResume(resumeId);
  }
}

export default ResumesServices;
