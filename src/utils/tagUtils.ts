import { NotFoundException } from '../exceptions/not-found-exception';
import { ErrorCode } from '../types/errorCodes';
import TagsRepository from '../repositories/TagsRepository';
const tagsRepository = new TagsRepository();

export async function tagsChecker(tags: number[] | string[]): Promise<number[]> {
  const tagIds: number[] = [];

  if (typeof tags[0] === 'number') {
    for (const tag of tags) {
      const foundTag = await tagsRepository.findTag(tag);
      if (foundTag) {
        tagIds.push(foundTag.id);
      } else throw new NotFoundException('Tag not found', ErrorCode.NOT_FOUND_TAG_EXCEPTION);
    }
  } else {
    for (const tag of tags) {
      const foundTag = await tagsRepository.findTag(tag);
      if (foundTag) {
        tagIds.push(foundTag.id);
      } else {
        const newTag = await tagsRepository.addTag(tag as string);
        tagIds.push(newTag.id);
      }
    }
  }

  return tagIds;
}
