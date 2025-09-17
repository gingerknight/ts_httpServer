import { db } from "../index.js";
import { type NewUser, users } from "../../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deletedUserIds() {
  const results = await db.delete(users).returning({ deletedId: users.id });
  return results;
}
