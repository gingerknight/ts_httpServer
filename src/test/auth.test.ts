import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "../lib/auth";
import { hashPassword, checkPasswordHash } from "../lib/auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result1 = await checkPasswordHash(password1, hash1);
    const result2 = await checkPasswordHash(password1, hash2);
    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });

  it("should return false for the wrong password", async () => {
    const result2 = await checkPasswordHash(password1, hash2);
    expect(result2).toBe(false);
  });
});

describe("JWT Creation", () => {
  const userId1 = "0001";
  const expiresIn1 = 50000;
  const secret1 = "spongebob";

  const userId2 = "0002";
  const expiresIn2 = 50000;
  const expiresIn3 = 0;
  const secret2 = "patrick-star";

  let userJwt1: string;
  let userJwt2: string;
  let userJwt3: string;

  beforeAll(async () => {
    userJwt1 = await makeJWT(userId1, expiresIn1, secret1);
    userJwt2 = await makeJWT(userId2, expiresIn2, secret2);
    userJwt3 = await makeJWT(userId1, expiresIn3, secret1);
  });

  it("should return the userId", async () => {
    const result = await validateJWT(userJwt1, secret1);
    expect(result).toBe(userId1);
  });
  it("should throw an Unauthorized error", async () => {
    expect(() => validateJWT(userJwt2, secret1)).toThrow(
      "Token invalid or expired..."
    );
  });
  it("should throw Unauthorized with expired token", async () => {
    expect(() => validateJWT(userJwt3, secret1)).toThrow(
      "Token invalid or expired..."
    );
  });
});
