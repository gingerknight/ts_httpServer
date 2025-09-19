import * as jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BadRequest, Unauthorized } from "../errors.js";
import type { Request } from "express";

type Payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;
const ISSUE = "chirpy";

export function hashPassword(plaintextPassword: string): Promise<string> {
  //  Hash the password using the bcrypt.hash function. Bcrypt is a secure hash function that is intended for use with passwords.
  const saltRounds = 10;
  const hashedPassword = bcrypt.hash(plaintextPassword, saltRounds);
  return hashedPassword;
}

export function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  // Use the bcrypt.compare function to compare the password in the HTTP request with the password that is stored in the database.
  return bcrypt.compare(password, hash);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = expiresIn + issuedAt;
  // Use jwt.sign(payload, secret, [options]).
  const payload = {
    iss: ISSUE,
    sub: userID,
    iat: issuedAt,
    exp: expiresAt,
  } satisfies Payload;
  // iss is the issuer of the token. Set this to chirpy
  // sub is the subject of the token, which is the user's ID.
  // iat is the time the token was issued. Use Math.floor(Date.now() / 1000) to get the current time in seconds.
  // exp is the time the token expires. Use iat + expiresIn to set the expiration

  const userJWT = jwt.sign(payload, secret, {
    algorithm: "HS256",
  });
  return userJWT;
}

export function validateJWT(tokenString: string, secret: string): string {
  // Use the jwt.verify(token, secret) function to validate the signature of the JWT and extract the decoded token payload.
  // It will throw an error if the token is invalid or has expired. If the token is invalid, throw a suitable error.
  // Return the user's id from the token (which should be stored in the sub field).
  try {
    const result = jwt.verify(tokenString, secret, {
      algorithms: ["HS256"],
    }) as JwtPayload; // add algorithms to prevent signature stripping attacks

    if (result.iss !== ISSUE) {
      throw new Unauthorized("Invalid Issuer...");
    }
    if (!result.sub) {
      throw new Unauthorized("Missing UserId...");
    }
    return result.sub;
  } catch (err) {
    throw new Unauthorized("Token invalid or expired...");
  }
}

export function getBearerToken(req: Request): string {
  // This function should look for the Authorization header in the request and return the TOKEN_STRING if it exists (stripping off the Bearer prefix and whitespace).
  // You can use the request's .get method.
  // If the header doesn't exist, throw an error.
  // This is an easy one to write a unit test for, and I'd recommend doing so.
  const tokenString = req.get("Authorization");
  if (tokenString) {
    const [bearer, token] = tokenString.trim().split(" ").filter(Boolean);
    if (bearer === "Bearer" && token) {
      return token;
    } else {
      throw new BadRequest("Missing Bearer header...");
    }
  } else {
    throw new BadRequest("Bad request, missing Authorization...");
  }
}
