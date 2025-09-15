import { config } from "../config.js";
import type { Request, Response } from "express";

export async function handlerMetrics(_: Request, resp: Response) {
  console.log(`Request for metrics processed: ${config.fileserverHits}`);
  resp.send(`Hits: ${config.fileserverHits}`);
}

export async function handlerResetMetrics(_: Request, resp: Response) {
  console.log("Resetting Endpoint Metrics to 0");
  config.fileserverHits = 0;
  // console.log(`Hits: ${config.fileserverHits}`);
  resp.send("Resetting Endpoint Metrics to 0");
}
