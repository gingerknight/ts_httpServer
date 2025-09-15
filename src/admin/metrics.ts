import { config } from "../config.js";
import type { Request, Response } from "express";

export async function handlerMetrics(_: Request, resp: Response) {
  console.log(`Request for metrics processed: ${config.fileserverHits}`);
  resp.set("Content-Type", "text/html; charset=utf-8");
  resp.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

export async function handlerResetMetrics(_: Request, resp: Response) {
  console.log("Resetting Endpoint Metrics to 0");
  config.fileserverHits = 0;
  // console.log(`Hits: ${config.fileserverHits}`);
  resp.send("Resetting Endpoint Metrics to 0");
}
