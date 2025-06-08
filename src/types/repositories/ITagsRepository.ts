import { Tag } from "../dataTypes/tagData";

export interface ITagsRepository {
  findTag(input: string | number): Promise<Tag|null>
  addTag(name: string): Promise<Tag>;
  listTags(): Promise<Tag[]>;
  hardDeleteTag(tagId: number): Promise<Tag>;
}
