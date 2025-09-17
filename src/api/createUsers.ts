import { createUser } from "../db/queries/users.js";
import type { NewUser } from "../schema.js";

import type { NextFunction, Request, Response } from "express";

export async function createNewUser(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  {
    // console.log("Attempting to parse user email...");
    let body = "";

    // Listen for data events
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy(); // Prevent DoS
    });

    // Listen for end events
    req.on("end", async () => {
      try {
        // Parse into JSON
        console.log("body:", JSON.parse(body).email);
        const userJson = JSON.parse(body) as NewUser;

        console.log(`Parsed Body content: ${JSON.stringify(userJson)}`);
        const result = await createUser(userJson);
        console.log(result);

        //resp.send("User created");
        resp.statusMessage = "Created";
        resp.header("Content-Type", "applicaiton/json");
        resp.status(201).send(result);
      } catch (error) {
        next(error); // Pass error to express to handle through middleware
      }
    });
  }
}
