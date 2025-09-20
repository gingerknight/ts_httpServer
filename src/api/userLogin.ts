import { lookupUser } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../lib/auth.js";
import { BadRequest, Unauthorized } from "../errors.js";

import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { config } from "../config.js";

export async function handlerUserLogin(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const UserInfo = z.object({
    email: z.string(),
    password: z.string(),
    expiresInSeconds: z.number().max(3600).catch(3600),
  });

  try {
    // TODO: Move Zod logic to common validation ts file to use for bo th login and create

    // Parse into JSON
    const body = UserInfo.safeParse(req.body);
    if (!body.success) {
      throw new BadRequest("Invalid JSON");
    }
    console.log("Checking login...");
    // get user by email
    const privateUser = await lookupUser(body.data.email);
    if (privateUser) {
      // compare pass/hash
      const authSuccess: boolean = await checkPasswordHash(
        body.data.password,
        privateUser.hashedPassword
      );
      if (authSuccess) {
        // successful authentication
        // create token
        const userToken = makeJWT(
          privateUser.id,
          body.data.expiresInSeconds || 3600,
          config.api.secret
        );
        resp.status(200).json({
          id: privateUser.id,
          email: privateUser.email,
          createdAt: privateUser.createdAt,
          updatedAt: privateUser.updatedAt,
          token: userToken,
        });
      } else {
        throw new Unauthorized("Incorrect email or password");
      }
    } else {
      throw new Unauthorized("Incorrect email or password");
    }
  } catch (error) {
    next(error); // Pass error to express to handle through middleware
  }
}
