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
  console.log(`Body: ${body}`);

  try {
    // Parse into JSON
    console.log("body:", body.email);
    console.log(`Parsed Body content: ${JSON.stringify(body)}`);

    console.log("Hashing Password...");
    const hashedPass = await hashPassword(body.password);

    const userData: NewUser = {
      email: body.email,
      hashedPassword: hashedPass,
    };
    const result = await createUser(userData);
    console.log(result);

    //resp.send("User created");
    resp.statusMessage = "Created";
    resp.status(201).json(result);
  } catch (error) {
    next(error); // Pass error to express to handle through middleware
  }
}
