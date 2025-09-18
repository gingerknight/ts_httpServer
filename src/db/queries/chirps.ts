import { db } from "../index.js";
import { type Chirps, users, chirps } from "../../schema.js";

export async function insertChirp(userChirp: Chirps) {
  const [result] = await db.insert(chirps).values(userChirp).returning();
  if (!result) throw new Error("Failed to insert chirp to Chirps table");
  return result;
}
