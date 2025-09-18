import type { NextFunction, Request, Response } from "express";
import {
  BadRequest,
  Forbidden,
  NotFoundError,
  Unauthorized,
} from "../errors.js";

type responseSuccess = {
  cleanedBody: string;
};

type responseError = {
  error: string;
};

type responseBody = responseSuccess | responseError;

const badWords = new Set(["kerfuffle", "sharbert", "fornax"]);
const maxChirpLength = 140;

export async function handlerValidateChirp(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  type parameters = {
    body: string;
  };
  const body: parameters = req.body;
  console.log(`Body: ${body}`);

  // check headers
  // console.log(`Checking headers: ${req.headers["content-type"]}`);
  if (body.body.length > maxChirpLength) {
    throw new BadRequest(`Chirp is too long. Max length is ${maxChirpLength}`);
  }
  try {
    // Check for banned words
    const cleanBody = cleanChirp(body.body);
    // console.log(`Parsed Body content: ${JSON.stringify(cleanBody)}`);
    const respBody: responseSuccess = {
      cleanedBody: cleanBody,
    };
    resp.status(200).send(JSON.stringify(respBody));
  } catch (error) {
    next(error); // Pass error to express to handle through middleware
  }
}

// Clean Chirp Helper
function cleanChirp(chirp: string): string {
  const chirpWords = chirp.split(" ");
  // console.log("chirpwords: ", chirpWords);
  const cleaned = chirpWords.map((word) =>
    badWords.has(word.toLowerCase()) ? "****" : word
  );
  return cleaned.join(" ");
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
