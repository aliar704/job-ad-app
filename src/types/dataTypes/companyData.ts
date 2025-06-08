export interface AddCompanyDTO {
  name: string;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  city: string | number;
  address?: string | null;
}

export interface UpdateCompanyDTO {
  name?: string;
  description?: string;
  website?: string;
  phone?: string;
  city?: string | number;
  address?: string;
}

export interface NormalizedCompanyInput {
  name?: string;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  city_id?: number;
  address?: string | null;
}
export interface Company {
  id: number;
  employer_id: number;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  city_id: number;
  address?: string;
  created_at: Date;
  deleted_at: Date;
}
export interface FullCompanyDTO extends Company {
  employer_name: string;
  city_name: string;
}
export interface MappedCompany {
  id: number;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  created_at: Date;
  deleted_at: Date;
  employer: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
}
