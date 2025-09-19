import { describe, it, expect } from "vitest";
import { handlerValidateChirp } from "../lib/validation/validateChirp";
import { BadRequest } from "../errors";

describe("handlerValidateChirp", () => {
  it("returns the chirp when it is valid", async () => {
    const body = "Hello world";
    const result = await handlerValidateChirp(body);
    expect(result).toBe(body);
  });

  it("redacts banned words regardless of casing", async () => {
    const body = "This Sharbert incident is wild";
    const result = await handlerValidateChirp(body);
    expect(result).toBe("This **** incident is wild");
  });

  it("throws BadRequest when the chirp exceeds the maximum length", async () => {
    const body = "a".repeat(141);
    await expect(handlerValidateChirp(body)).rejects.toThrow(BadRequest);
    await expect(handlerValidateChirp(body)).rejects.toThrow(
      "Chirp is too long. Max length is 140"
    );
  });

  it("throws BadRequest when the chirp is empty", async () => {
    await expect(handlerValidateChirp("")).rejects.toThrow(BadRequest);
    await expect(handlerValidateChirp("")).rejects.toThrow("Invalid chirp");
  });
});
