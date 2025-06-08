import { ICitiesRepository } from '../types/repositories';
import { NotFoundException } from '../exceptions/not-found-exception';
import { getOrSetCache } from '../utils/cacheUtils';
import { RedisKeys } from '../types/redisKeys';
import { invalidateAllCitiesCache } from '../cache/citiesCache';
import { normalizeCityInput } from '../utils/normalizationUtils';
import { City, CreateCityDTO } from '../types/dataTypes/cityData';
import { ErrorCode } from '../types/errorCodes';
import { ConflictException } from '../exceptions/conflict-exception';

class CitiesServices {
  private citiesRepository: ICitiesRepository;

  constructor(citiesRepository: ICitiesRepository) {
    this.citiesRepository = citiesRepository;
  }

  async findCity(input: string | number): Promise<City | null> {
    const city = await this.citiesRepository.findCity(input);
    return city;
  }

  async addCity(data: CreateCityDTO): Promise<City> {
    const normalizedData = normalizeCityInput(data);
    const foundCity = await this.citiesRepository.findCity(normalizedData.name);
    if (foundCity) {
      throw new ConflictException('City already exists', ErrorCode.CONFLICT_EXCEPTION);
    }
    const city = await this.citiesRepository.addCity(normalizedData);
    invalidateAllCitiesCache();
    return city;
  }

  async getAllCities(): Promise<City[]> {
    return await getOrSetCache(RedisKeys.ALL_CITIES, () => this.citiesRepository.listCities());
  }

  async deleteCity(id: number): Promise<City> {
    const city = await this.citiesRepository.hardDeleteCity(id);
    if (!city) throw new NotFoundException('City not found!', ErrorCode.NOT_FOUND_CITY_EXCEPTION);
    return city;
  }
}

export default CitiesServices;
