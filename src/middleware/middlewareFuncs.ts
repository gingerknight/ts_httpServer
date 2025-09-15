import type { Request, Response, NextFunction } from "express";

export async function middlewareLogResponses(
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
