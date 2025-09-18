import * as z from "zod";

import { insertChirp } from "../db/queries/chirps.js";
import { handlerValidateChirp } from "../lib/validation/validateChirp.js";
import type { NextFunction, Request, Response } from "express";

type responseSuccess = {
  cleanedBody: string;
};

type responseError = {
  error: string;
};

type responseBody = responseSuccess | responseError;

export async function handlerChirps(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  // extract the inferred type
  type parameters = z.infer<typeof UserChirp>;

  const UserChirp = z.object({
    body: z.string(),
    userId: z.string(),
  });

  const userChirp: parameters = req.body;
  console.log(`Body: ${JSON.stringify(userChirp)}`);

  /*
  // Sample POST body
  {
    "body": "Hello, world!",
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
  */

  try {
    // Check for banned words

    const cleanBody = await handlerValidateChirp(userChirp.body);
    // console.log(`Parsed Body content: ${JSON.stringify(cleanBody)}`);
    userChirp.body = cleanBody;
    const result = await insertChirp(userChirp);
    console.log(result);

    resp.statusMessage = "Added Chirp to table";
    resp.status(201).send(result);
  } catch (error) {
    next(error); // Pass error to express to handle through middleware
  }
}

/*
async function handler(req: Request, res: Response) {
  type responseData = {
    createdAt: string;
    ID: number;
  };

  const respBody: responseData = {
    createdAt: new Date().toISOString(),
    ID: 123,
  };

  res.header("Content-Type", "application/json");
  const body = JSON.stringify(respBody);
  res.status(200).send(body);
}
*/
