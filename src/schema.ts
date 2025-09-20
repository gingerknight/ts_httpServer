import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").notNull().default("unset"),
});

export type NewUser = typeof users.$inferInsert;
export type PublicUser = Omit<typeof users.$inferSelect, "hashedPassword">;

/*
{
  "id": "94b7e44c-3604-42e3-bef7-ebfcc3efff8f",
  "createdAt": "2021-01-01T00:00:00Z",
  "updatedAt": "2021-01-01T00:00:00Z",
  "body": "Hello, world!",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
*/
export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar("body", { length: 140 }).notNull(),
  userId: uuid().references((): AnyPgColumn => users.id, {
    onDelete: "cascade",
  }),
});

export type Chirps = typeof chirps.$inferInsert;

export const refreshTokens = pgTable("refresh_tokens", {
  token: varchar("token").primaryKey().notNull(),
  reatedAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  userId: uuid().references((): AnyPgColumn => users.id, {
    onDelete: "cascade",
  }),
  expiresAt: timestamp("expires_at"),
  revokedAt: timestamp("revoked_at"),
});

export type RefreshTokens = typeof refreshTokens.$inferInsert;
