import { db } from "../index.js";
import { type NewUser, users } from "../../schema.js";
import { Conflict } from "../../errors.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  if (!result) throw new Conflict("User already exists");
  return result;
}

export async function deletedUserIds() {
  const results = await db.delete(users).returning({ deletedId: users.id });
  return results;
}
