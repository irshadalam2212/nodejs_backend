import redisClient from "../config/redis";

export const setCache = async (
  key: string,
  value: unknown,
  ttlSeconds = 300,
) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttlSeconds,
  });
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const value = await redisClient.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
};

export const deleteCache = async (key: string) => {
  await redisClient.del(key);
};
