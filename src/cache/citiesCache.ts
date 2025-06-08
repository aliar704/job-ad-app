import { getFromCache, setToCache, deleteFromCache } from './redisHelper';
import { RedisKeys } from '../types/redisKeys';
import { City } from '../types/dataTypes/cityData';

export function getAllCitiesCache() {
  return getFromCache<City[]>(RedisKeys.ALL_CITIES);
}

export function setAllCitiesCache(data: City[]) {
  return setToCache(RedisKeys.ALL_CITIES, data);
}

export function invalidateAllCitiesCache() {
  return deleteFromCache(RedisKeys.ALL_CITIES);
}
