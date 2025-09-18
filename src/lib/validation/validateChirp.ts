import type { NextFunction } from "express";
import { BadRequest } from "../../errors.js";

const badWords = new Set(["kerfuffle", "sharbert", "fornax"]);
const maxChirpLength = 140;

export async function handlerValidateChirp(body: string) {
  // check headers
  // console.log(`Checking headers: ${req.headers["content-type"]}`);
  console.log(`handlerValidateChirp Body Param: ${body}`);
  if (body.length > maxChirpLength) {
    throw new BadRequest(`Chirp is too long. Max length is ${maxChirpLength}`);
  }
  // Check for banned words
  console.log(`Body before cleaning: ${body}`);
  const cleanBody = cleanChirp(body);
  // console.log(`Parsed Body content: ${JSON.stringify(cleanBody)}`);
  if (!cleanBody) {
    throw new BadRequest("Invalid chirp");
  }
  return cleanBody;
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
