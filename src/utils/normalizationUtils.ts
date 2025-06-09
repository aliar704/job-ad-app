import { CreateCityDTO, NormalizedCityDTO } from '../types/dataTypes/cityData';
import {
  AddCompanyDTO,
  NormalizedCompanyInput,
  UpdateCompanyDTO,
} from '../types/dataTypes/companyData';
import { CreateJobAdDTO, NormalizedJobAdData, UpdateJobAdDTO } from '../types/dataTypes/jobAdData';
import { CreateResumeDTO, UpdateResumeDTO } from '../types/dataTypes/resumeData';
import { SearchJobAdsDTO } from '../types/dataTypes/searchData';
import { NormalizedUserInput, Role, SignupDTO, UpdateUserDTO } from '../types/dataTypes/userData';
//user normalization
export function normalizeSignupInput(data: SignupDTO): NormalizedUserInput {
  return {
    email: data.email.trim().toLowerCase(),
    password: data.password,
    password_hash: undefined,
    full_name: data.full_name.trim().toLowerCase(),
    role: data.role.trim().toLowerCase() as Role,
    phone: data.phone.trim(),
    city_id: data.city as number,
    birth_date: data.birth_date || null,
  };
}
export function normalizeUserUpdateInput(data: UpdateUserDTO): NormalizedUserInput {
  return {
    full_name: data.full_name?.trim().toLowerCase(),
    phone: data.phone?.trim(),
    city_id: typeof data.city === 'number' ? data.city : undefined,
    birth_date: data.birth_date ?? undefined,
  };
}

//city normalization
export function normalizeCityInput(data: CreateCityDTO): NormalizedCityDTO {
  return {
    name: data.name.trim().toLowerCase(),
    country: data.country?.trim().toLowerCase() || null,
  };
}

//company normalization
export function normalizeCreateCompanyInput(data: AddCompanyDTO): NormalizedCompanyInput {
  return {
    name: data.name.trim().toLowerCase(),
    description: data.description?.trim().toLowerCase() || null,
    website: data.website?.trim().toLowerCase() || null,
    phone: data.phone?.trim().toLowerCase() || null,
    address: data.address?.trim().toLowerCase() || null,
    city_id: data.city as number,
  };
}

export function normalizeUpdateCompanyInput(data: UpdateCompanyDTO): NormalizedCompanyInput {
  return {
    name: data.name?.trim().toLowerCase(),
    description: data.description?.trim().toLowerCase(),
    website: data.website?.trim().toLowerCase(),
    phone: data.phone?.trim().toLowerCase(),
    address: data.address?.trim().toLowerCase(),
    city_id: typeof data.city === 'number' ? data.city : undefined,
  };
}

//jobad normalization
export function normalizeCreateJobAdDTO(data: CreateJobAdDTO): NormalizedJobAdData {
  return {
    title: data.title.trim().toLowerCase(),
    description: data.description.trim().toLowerCase(),
    salary_min: data.salary_min || null,
    salary_max: data.salary_max || null,
    type: data.type.toLowerCase() as typeof data.type,
    company_id: data.company_id,
    experience_level: data.experience_level.toLowerCase() as typeof data.experience_level,
  };
}
export function normalizeUpdateJobAdDTO(data: UpdateJobAdDTO): NormalizedJobAdData {
  return {
    title: data.title?.trim().toLowerCase(),
    description: data.description?.trim().toLowerCase(),
    salary_min: data.salary_min ?? undefined,
    salary_max: data.salary_max ?? undefined,

    type: data.type?.toLowerCase() as typeof data.type,
    experience_level: data.experience_level?.toLowerCase() as typeof data.experience_level,
    company_id: data.company_id ?? undefined,
  };
}

//search normalization
export function normalizeSearchJobAdsDTO(data: SearchJobAdsDTO): SearchJobAdsDTO {
  const tags: string[] = [];
  if (data.tags) {
    for (const tag of data.tags) {
      tags.push(tag.toLowerCase());
    }
  }

  return {
    title: data.title?.trim().toLowerCase(),
    company: data.company?.trim().toLowerCase(),
    city: data.city?.trim().toLowerCase(),
    tags,
  };
}

//resume normalization
export function normalizeCreateResumeDTO(data: CreateResumeDTO): CreateResumeDTO {
  return {
    title: data.title.trim().toLowerCase(),
    content: data.content.trim().toLowerCase(),
    file_url: data.file_url?.trim().toLowerCase() || null,
  };
}
export function normalizeUpdateResumeDTO(data: UpdateResumeDTO): UpdateResumeDTO {
  return {
    title: data.title?.trim().toLowerCase(),
    content: data.content?.trim().toLowerCase(),
    file_url: data.file_url?.trim().toLowerCase(),
  };
}
