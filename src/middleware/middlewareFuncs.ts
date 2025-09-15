import { config } from "../config.js";

import type { Request, Response, NextFunction } from "express";

export function middlewareLogResponses(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  resp.on("finish", () => {
    // catch status-code, look for non-ok
    if (resp.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${resp.statusCode}`
      );
    }
  });
  next();
}

export function middlewareMetricsInc(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  // skip metrics/reset
  if (req.path === "/metrics" || req.path === "/reset") return next();

  config.fileserverHits += 1;
  // console.log(`hits count: ${config.fileserverHits}`);
  // console.log("Req method:", req.method);
  // console.log("Req path:", req.path);
  next();
}
