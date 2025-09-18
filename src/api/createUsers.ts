import { createUser } from "../db/queries/users.js";
import type { NewUser } from "../schema.js";

import type { NextFunction, Request, Response } from "express";

export async function createNewUser(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  type parameters = {
    email: string;
  };
  const body: parameters = req.body;
  console.log(`Body: ${body}`);

  try {
    // Parse into JSON
    console.log("body:", body.email);
    const userJson = body as NewUser;

    console.log(`Parsed Body content: ${JSON.stringify(userJson)}`);
    const result = await createUser(userJson);
    console.log(result);

    //resp.send("User created");
    resp.statusMessage = "Created";
    resp.status(201).json(result);
  } catch (error) {
    next(error); // Pass error to express to handle through middleware
  }
}
