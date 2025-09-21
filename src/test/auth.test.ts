import { describe, it, expect, beforeAll, vi } from "vitest";
import { getBearerToken, makeJWT, validateJWT } from "../lib/auth";
import { hashPassword, checkPasswordHash } from "../lib/auth";
import type { Request } from "express";
import { BadRequest } from "../errors";

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
  const secret1 = "spongebob";

  const userId2 = "0002";
  const expiresIn3 = -1;
  const secret2 = "patrick-star";

  let userJwt1: string;
  let userJwt2: string;
  let userJwt3: string;

  beforeAll(async () => {
    userJwt1 = await makeJWT(userId1, secret1);
    userJwt2 = await makeJWT(userId2, secret2);
    userJwt3 = await makeJWT(userId1, secret1, expiresIn3);
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

describe("getBearerToken", () => {
  const buildRequest = (Authorization?: string) => {
    const get = vi.fn(() => Authorization ?? undefined);
    const req = { get } as unknown as Request;
    return { req, get };
  };
  it("returns the raw token with Autohrization uses 'Bearer'", () => {
    const token = "the-actual-bearer-token";
    const { req, get } = buildRequest(`Bearer ${token}`);
    const result = getBearerToken(req);

    expect(get).toHaveBeenCalledWith("Authorization");
    expect(result).toBe(token);
  });
  it("should throw BadRequest missing Authorization", () => {
    const token = "the-actual-bearer-token";
    const { req, get } = buildRequest(`SandySquirrel ${token}`);
    expect(() => getBearerToken(req)).toThrowError(BadRequest);
  });
  it("should throw BadRequest missing token", () => {
    const token = "the-actual-bearer-token";
    const { req, get } = buildRequest(`Bearer      `);
    expect(() => getBearerToken(req)).toThrowError(BadRequest);
  });
  it("returns the raw token and handles weird spacing", () => {
    const token = "the-actual-bearer-token";
    const { req, get } = buildRequest(`    Bearer    ${token}   `);

    const result = getBearerToken(req);
    expect(get).toHaveBeenCalledWith("Authorization");
    expect(result).toBe(token);
  });
});
