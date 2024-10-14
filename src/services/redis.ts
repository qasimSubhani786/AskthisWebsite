"use server";

import { redis } from "@/lib/redis";

export const checkIfExistsinRedis = async (filename: string) => {
  return await redis.sismember("indexed-filename", filename);
};

export const addinRedis = async (filename: string) => {
  return await redis.sadd("indexed-filename", filename);
};
