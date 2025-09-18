import type { NextFunction } from "express";
import { BadRequest } from "../../errors.js";

const badWords = new Set(["kerfuffle", "sharbert", "fornax"]);
const maxChirpLength = 140;

export async function handlerValidateChirp(body: string) {
  if (body.length > maxChirpLength) {
    throw new BadRequest(`Chirp is too long. Max length is ${maxChirpLength}`);
  }
  // Check for banned words
  const cleanBody = cleanChirp(body);
  if (!cleanBody) {
    throw new BadRequest("Invalid chirp");
  }
  return cleanBody;
}

// Clean Chirp Helper
function cleanChirp(chirp: string): string {
  const chirpWords = chirp.split(" ");
  const cleaned = chirpWords.map((word) =>
    badWords.has(word.toLowerCase()) ? "****" : word
  );
  return cleaned.join(" ");
}
