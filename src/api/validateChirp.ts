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
  // console.log("Validating chirp...");
  let body = "";

  // Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1_000_000) req.destroy(); // Prevent DoS
  });

  // Listen for end events
  req.on("end", () => {
    try {
      // Check for banned words
      console.log("body:", JSON.parse(body).body);
      const cleanBody = cleanChirp(JSON.parse(body).body);
      console.log(`Parsed Body content: ${JSON.stringify(cleanBody)}`);
      resp.header("Content-Type", "applicaiton/json");
      if (JSON.stringify(cleanBody).length <= 140) {
        const respBody: responseSuccess = {
          cleanedBody: cleanBody,
        };
        resp.status(200).send(JSON.stringify(respBody));
      } else {
        throw new BadRequest(
          `Chirp is too long. Max length is ${maxChirpLength}`
        );
      }
    } catch (error) {
      next(error); // Pass error to express to handle through middleware
    }
  });
}

// Clean Chirp Helper
function cleanChirp(chirp: string): string {
  const chirpWords = chirp.split(" ");
  console.log("chirpwords: ", chirpWords);
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
