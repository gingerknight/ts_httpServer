import { createUser } from "../db/queries/users.js";
import type { NewUser } from "../schema.js";

import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

export function hashPassword(plaintextPassword: string): Promise<string> {
  //  Hash the password using the bcrypt.hash function. Bcrypt is a secure hash function that is intended for use with passwords.
  const saltRounds = 10;
  const hashedPassword = bcrypt.hash(plaintextPassword, saltRounds);
  return hashedPassword;
}

/*
export function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  // Use the bcrypt.compare function to compare the password in the HTTP request with the password that is stored in the database.
}
  */
