import * as z from "zod";

import { getChirp, insertChirp } from "../db/queries/chirps.js";
import { handlerValidateChirp } from "../lib/validation/validateChirp.js";
import { getChirps } from "../db/queries/chirps.js";
import { BadRequest, NotFoundError } from "../errors.js";

import type { NextFunction, Request, Response } from "express";

export async function handlerGetChirp(req: Request, resp: Response) {
  console.log("Fetching single chirp");
  const chirpId = req.params.chirpID;
  if (chirpId) {
    console.log("Checking db...");
    const singleChirp = await getChirp(chirpId);
    resp.json(singleChirp);
  } else {
    throw new BadRequest("Chirp ID missing...");
  }
}

export async function handlerAllChirps(req: Request, res: Response) {
  console.log("Request for allChirps...");
  /*
  [
    {
        "id": "94b7e44c-3604-42e3-bef7-ebfcc3efff8f",
        "createdAt": "2021-01-01T00:00:00Z",
        "updatedAt": "2021-01-01T00:00:00Z",
        "body": "Yo fam this feast is lit ong",
        "userId": "123e4567-e89b-12d3-a456-426614174000"
    },
    {
        "id": "f0f87ec2-a8b5-48cc-b66a-a85ce7c7b862",
        "createdAt": "2022-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z",
        "body": "What's good king?",
        "userId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ]
  */
  const chirps = await getChirps();
  res.json(chirps);
}

export async function handlerChirps(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  const UserChirp = z.object({
    body: z.string(),
    userId: z.string(),
  });

  const userChirp = UserChirp.parse(req.body);
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
    userChirp.body = cleanBody;
    const result = await insertChirp(userChirp);
    console.log(result);

    resp.statusMessage = "Added Chirp to table";
    resp.status(201).send(result);
  } catch (error) {
    next(error); // Pass error to express to handle through middleware
  }
}
