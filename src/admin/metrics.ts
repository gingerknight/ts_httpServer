import { config } from "../config.js";
import { deletedUserIds } from "../db/queries/users.js";
import { Forbidden } from "../errors.js";
import type { Request, Response } from "express";

export async function handlerMetrics(_: Request, resp: Response) {
  console.log(`Request for metrics processed: ${config.api.fileServerHits}`);
  resp.set("Content-Type", "text/html; charset=utf-8");
  resp.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
  </body>
</html>`);
}

export async function handlerResetData(_: Request, resp: Response) {
  if (config.api.platform === "dev") {
    console.log("Resetting Endpoint Metrics to 0");
    config.api.fileServerHits = 0;
    const results = await deletedUserIds();
    console.log(results);
    // console.log(`Hits: ${config.api.fileserverHits}`);
    resp.send(
      "Resetting Endpoint Metrics to 0\nDeleted users from users table"
    );
  } else {
    throw new Forbidden("Not in Dev");
  }
}
