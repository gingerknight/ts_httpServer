import { db } from "../index.js";
import { type NewUser, users, type PublicUser } from "../../schema.js";
import { Conflict } from "../../errors.js";

export async function createUser(user: NewUser): Promise<PublicUser> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  if (!result) throw new Conflict("User already exists");
  return result;
}

export async function deletedUserIds() {
  const results = await db.delete(users).returning({ deletedId: users.id });
  return results;
}
