export interface CreateResumeDTO {
  title: string;
  content: string;
  file_url?: string | null;
}
export interface UpdateResumeDTO {
  title?: string;
  content?: string;
  file_url?: string;
}
export interface Resume {
  id: number;
  jobseeker_id: number;
  title: string;
  content: string;
  file_url: string ;
  created_at: Date;
  deleted_at: Date;
}
