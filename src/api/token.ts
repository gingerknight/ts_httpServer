// handlerRefreshToken
import { getBearerToken, makeJWT } from "../lib/auth.js";

import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import {
  getUserFromRefreshToken,
  revokeRefreshToken,
} from "../db/queries/auth.js";
import { Unauthorized } from "../errors.js";

export async function handlerRefreshToken(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  // look for auth header
  const clientRefreshToken = getBearerToken(req);
  const [userData] = await getUserFromRefreshToken(clientRefreshToken);
  if (userData !== undefined) {
    const newJWT = makeJWT(userData.userId, config.api.secret);
    return resp.status(200).json({ token: newJWT });
  }
  throw new Unauthorized("Token missing, expired, or revoked...");
}

export async function handlerRevokeToken(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  try {
    const clientRefreshToken = getBearerToken(req);
    const [userData] = await getUserFromRefreshToken(clientRefreshToken);
    if (userData !== undefined) {
      const result = await revokeRefreshToken(clientRefreshToken);
      resp.status(204).send();
    }
  } catch (error) {
    next(error);
  }
}
