import { db } from "../index.js";
import {
  type RefreshTokens,
  refreshTokens,
  type SelectRefreshTokens,
} from "../../schema.js";
import { eq, and, isNull } from "drizzle-orm";
import { NotFoundError, Unauthorized } from "../../errors.js";

export async function insertRefreshToken(refreshToken: RefreshTokens) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();
  if (!result)
    throw new Error("Failed to insert refreshToken into refresh_tokens table");
  return result;
}

export async function getRefreshToken(userToken: string) {
  const result: SelectRefreshTokens[] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, userToken));
  if (!result) throw new NotFoundError("Failed to get refresh token...");
  return result;
}

export async function getUserFromRefreshToken(userToken: string) {
  const result: RefreshTokens[] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(eq(refreshTokens.token, userToken), isNull(refreshTokens.revokedAt))
    );
  if (!result)
    throw new Unauthorized("Failed to find matching refresh token for user...");
  return result;
}

export async function revokeRefreshToken(userToken: string) {
  const value = { revokedAt: new Date() };
  const [result] = await db
    .update(refreshTokens)
    .set(value)
    .where(eq(refreshTokens.token, userToken))
    .returning();
  return result;
}
