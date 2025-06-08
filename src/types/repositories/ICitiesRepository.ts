import { City, NormalizedCityDTO } from "../dataTypes/cityData";

export interface ICitiesRepository {
  findCity(input: string | number): Promise<City | null>;
  addCity(data: NormalizedCityDTO): Promise<City>;
  listCities(): Promise<City[]>;
  hardDeleteCity(id: number): Promise<City | undefined>;
}
