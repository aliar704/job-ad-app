export interface CreateCityDTO {
  name: string;
  country?: string;
}
export interface NormalizedCityDTO {
  name: string;
  country: string | null;
}

export interface City {
  id: number;
  name: string;
  country?: string;
  created_at: Date;
}
