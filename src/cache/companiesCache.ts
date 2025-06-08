import { getFromCache, setToCache, deleteFromCache } from './redisHelper';
import { RedisKeys } from '../types/redisKeys';
import { Company } from '../types/dataTypes/companyData';

export function getAllCompaniesCache() {
  return getFromCache<Company[]>(RedisKeys.ALL_COMPANIES);
}

export function setAllCompaniesCache(data: Company[]) {
  return setToCache(RedisKeys.ALL_COMPANIES, data);
}

export function invalidateAllCompaniesCache() {
  return deleteFromCache(RedisKeys.ALL_COMPANIES);
}
