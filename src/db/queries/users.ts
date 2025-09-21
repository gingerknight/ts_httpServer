import { db } from "../index.js";
import { type NewUser, users, type PublicUser } from "../../schema.js";
import { Conflict } from "../../errors.js";
import { eq } from "drizzle-orm";

type UpdateUserInput = {
  id: string;
  email: string;
  hashedPassword: string;
};

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

export async function lookupUserByEmail(
  email: string
): Promise<typeof users.$inferSelect | undefined> {
  const [results] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  return results;
}

export async function lookupUserById(
  id: string
): Promise<typeof users.$inferSelect | undefined> {
  const [results] = await db.select().from(users).where(eq(users.id, id));
  return results;
}

export async function updateUser(user: UpdateUserInput): Promise<PublicUser> {
  const value = {
    hashedPassword: user.hashedPassword,
    email: user.email,
  };
  const [result] = await db
    .update(users)
    .set(value)
    .where(eq(users.id, user.id))
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  if (!result)
    throw new Error("Unable to update user's hash password...");
  return result;
}
