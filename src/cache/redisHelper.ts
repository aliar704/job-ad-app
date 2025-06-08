import redisClient from '../db/redis';

export async function getFromCache<T>(key: string): Promise<T | null> {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setToCache<T>(key: string, value: T, ttl = 3600): Promise<void> {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
}

export async function deleteFromCache(key: string): Promise<void> {
  await redisClient.del(key);
}
