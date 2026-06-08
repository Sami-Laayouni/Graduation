/**
 * Redis client for production (Vercel KV / Upstash).
 * When KV credentials are absent (local dev without Redis), USE_REDIS is false
 * and all store modules fall back to their in-memory implementations.
 */
import { Redis } from "@upstash/redis";

const url =
  process.env.KV_REST_API_URL ??
  process.env.UPSTASH_REDIS_REST_URL ??
  "";

const token =
  process.env.KV_REST_API_TOKEN ??
  process.env.UPSTASH_REDIS_REST_TOKEN ??
  "";

export const USE_REDIS = Boolean(url && token);

export const redis: Redis | null = USE_REDIS
  ? new Redis({ url, token })
  : null;

/** Default TTL for session-scoped keys: 48 hours */
export const SESSION_TTL = 60 * 60 * 48;
