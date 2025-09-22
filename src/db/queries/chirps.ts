import { db } from "../index.js";
import { type Chirps, chirps } from "../../schema.js";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../errors.js";

export async function insertChirp(userChirp: Chirps) {
  const [result] = await db.insert(chirps).values(userChirp).returning();
  if (!result) throw new Error("Failed to insert chirp to Chirps table");
  return result;
}

export async function getChirps() {
  const result: Chirps[] = await db.select().from(chirps);
  if (!result) throw new Error("Failed to get chirps...");
  return result;
}

export async function getChirp(chirpId: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  if (!result) throw new NotFoundError("Chirp ID Invalid");
  return result;
}

export async function deleteChirp(chirpId: string) {
  const [result] = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId))
    .returning();
  if (!result)
    throw new NotFoundError("Chirp ID Invalid, and failed to delete...");
  return result;
}
