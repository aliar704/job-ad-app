export interface SignupDTO {
  email: string;
  password: string;
  full_name: string;
  role: Role;
  phone: string;
  birth_date?: Date;
  city: string | number;
}
export interface LoginDTO {
  email: string;
  password: string;
}
export interface NormalizedUserInput {
  email?: string;
  password?:string;
  password_hash?: string;
  full_name?: string;
  role?: Role;
  phone?: string;
  birth_date?: Date | null;
  city_id?: number;
}
export interface UpdateUserDTO {
  full_name?: string;
  phone?: string;
  birth_date?: Date;
  city?: string | number;
}
export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: Role;
  phone: string;
  city_id: number;
  birth_date: Date;
  created_at: Date;
  deleted_at: Date | null;
}

export enum Role {
  ADMIN = 'admin',
  JOBSEEKER = 'jobseeker',
  EMPLOYEE = 'employer',
}
