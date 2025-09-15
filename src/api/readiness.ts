import type { Request, Response } from "express";

export async function handlerReadiness(_: Request, res: Response) {
  console.log("Request for healthz");
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}
