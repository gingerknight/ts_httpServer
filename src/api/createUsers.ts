import { createUser } from "../db/queries/users.js";
import type { NewUser } from "../schema.js";
import { hashPassword } from "../lib/auth.js";

import type { NextFunction, Request, Response } from "express";

export async function createNewUser(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  type parameters = {
    email: string;
    password: string;
  };
  const body: parameters = req.body;

  try {
    // Parse into JSON
    console.log("Hashing Password...");
    const hashedPass = await hashPassword(body.password);

    const userData: NewUser = {
      email: body.email,
      hashedPassword: hashedPass,
    };

    console.log("Creating user...");
    const result = await createUser(userData);

    resp.statusMessage = "Created";
    resp.status(201).json(result);
  } catch (error) {
    next(error); // Pass error to express to handle through middleware
  }
}
