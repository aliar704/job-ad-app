import { getFromCache, setToCache } from './redisHelper';

export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  const cached = await getFromCache<T>(key);
  if (cached) return cached;

  const freshData = await fetchFn();
  await setToCache(key, freshData, ttlSeconds);
  return freshData;
}
