export interface AddJobTagDTO {
  tags: string[] | number[];
}

export interface JobTag {
  job_ad_id: number;
  tag_id: number;
}
