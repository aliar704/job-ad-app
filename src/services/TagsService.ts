import { ErrorCode} from '../types/errorCodes';
import { ITagsRepository } from '../types/repositories/';
import { NotFoundException } from '../exceptions/not-found-exception';
import { Tag } from '../types/dataTypes/tagData';
import { ConflictException } from '../exceptions/conflict-exception';

class TagsServices {
  private tagsRepository: ITagsRepository;

  constructor(tagsRepository: ITagsRepository) {
    this.tagsRepository = tagsRepository;
  }

  async addTag(name: string): Promise<Tag> {
    const foundTag = await  this.tagsRepository.findTag(name.toLowerCase());
    if(foundTag){
      throw new ConflictException('Tag already exists',ErrorCode.CONFLICT_EXCEPTION)
    }
    const tag = await this.tagsRepository.addTag(name.toLowerCase());
    return tag;
  }

  async getAllTags(): Promise<Tag[]> {
    const tags = await this.tagsRepository.listTags();
    return tags;
  }

  async deleteTag(tagId: number): Promise<Tag> {
    const foundTag = await this.tagsRepository.findTag(tagId);
    if (!foundTag) throw new NotFoundException('Tag not found!', ErrorCode.NOT_FOUND_TAG_EXCEPTION);
    const tag = await this.tagsRepository.hardDeleteTag(tagId);
    return tag;
  }
}

export default TagsServices;
