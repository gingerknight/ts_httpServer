import * as z from "zod";

import type { NextFunction, Request, Response } from "express";
import { BadRequest, NotFoundError, Unauthorized } from "../errors.js";
import { lookupUserById, upgradeUser } from "../db/queries/users.js";
import { getAPIKey } from "../lib/auth.js";
import { config } from "../config.js";

export async function handlerPolkaWebhook(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  /*
  {
    "event": "user.upgraded",
    "data": {
        "userId": "3311741c-680c-4546-99f3-fc9efac2036c"
        }
    }
  */
  const Data = z.object({
    userId: z.uuid(),
  });
  const Event = z.object({
    event: z.string(),
    data: Data,
  });

  try {
    const polkaToken = getAPIKey(req);
    if (polkaToken !== config.api.polkaKey) {
      throw new Unauthorized("API keys don't match....");
    }
    const body = Event.safeParse(req.body);
    if (!body.success) {
      console.log(`Bad JSON: ${JSON.stringify(body)}`);
      throw new BadRequest("Invalid JSON");
    }
    if (body.data.event !== "user.upgraded") {
      console.log(`Not user.upgraded...`);
      resp.status(204).send();
    } else {
      const userInDb = lookupUserById(body.data.data.userId);
      if (!userInDb) {
        throw new NotFoundError("User not found in DB...");
      }
      const result = await upgradeUser(body.data.data.userId);
      resp.status(204).send();
    }
  } catch (error) {
    next(error);
  }
}
