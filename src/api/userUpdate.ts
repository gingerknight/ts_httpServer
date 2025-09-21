import * as z from "zod";
import { getBearerToken, validateJWT, hashPassword } from "../lib/auth.js";
import { BadRequest, Unauthorized } from "../errors.js";

import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { lookupUserById, updateUser } from "../db/queries/users.js";

export async function handlerUpdateUser(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const Parameters = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  const body = Parameters.safeParse(req.body);

  if (!body.success) {
    throw new BadRequest("Invalid JSON");
  }
  console.log(`handlerUpdateUser Body: ${JSON.stringify(body.data)}`);
  try {
    console.log("Getting Auth token from header...");
    const userJWT = getBearerToken(req);
    const userId = validateJWT(userJWT, config.api.secret);
    const privateUser = await lookupUserById(userId);
    if (!privateUser) {
      throw new Unauthorized("Token mismatch, or user mismatch...");
    }

    const hashedPass = await hashPassword(body.data.password);
    const updatedUser = await updateUser({
      id: userId,
      email: body.data.email,
      hashedPassword: hashedPass,
    });
    resp.status(200).json(updatedUser);
  } catch (error) {
    console.log(`Error: ${JSON.stringify(error)}`);
    next(error);
  }
}
