import { config } from "../config.js";
import {
  BadRequest,
  Conflict,
  Forbidden,
  NotFoundError,
  Unauthorized,
} from "../errors.js";

import type { Request, Response, NextFunction } from "express";

export function middlewareLogResponses(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  resp.on("finish", () => {
    // catch status-code, look for non-ok
    if (resp.statusCode >= 300) {
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

  config.api.fileServerHits += 1;
  // console.log(`hits count: ${config.api.fileserverHits}`);
  // console.log("Req method:", req.method);
  // console.log("Req path:", req.path);
  next();
}

export function middlewareErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("We gotza an error here!");
  if (err instanceof BadRequest) {
    res.status(400).json({
      error: err.message,
    });
  } else if (err instanceof Unauthorized) {
    res.status(401).send(err.message);
  } else if (err instanceof Forbidden) {
    res.status(403).send(err.message);
  } else if (err instanceof NotFoundError) {
    res.status(404).send(err.message);
  } else if (err instanceof Conflict) {
    res.status(409).send(err);
  } else {
    res.status(500).json({
      error: "Something went wrong on our end",
    });
    console.log(err);
  }
}
