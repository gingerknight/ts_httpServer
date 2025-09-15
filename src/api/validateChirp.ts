import type { Request, Response } from "express";

type responseSuccess = {
  valid: boolean;
};

type responseError = {
  error: string;
};

type responseBody = responseSuccess | responseError;

export async function handlerValidateChirp(req: Request, resp: Response) {
  // console.log("Validating chirp...");
  let body = ""; // 1. Initialize

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  // console.log(`body: ${body}`);

  // 3. Listen for end events
  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body);
      // now you can use `parsedBody` as a JavaScript object
      console.log(`Parsed Body content: ${JSON.stringify(parsedBody)}`);
      resp.header("Content-Type", "applicaiton/json");
      if (JSON.stringify(parsedBody).length <= 140) {
        const respBody: responseSuccess = {
          valid: true,
        };
        resp.status(200).send(JSON.stringify(respBody));
      } else {
        const respBody: responseError = {
          error: "Chirp is too long",
        };
        resp.status(400).send(JSON.stringify(respBody));
      }
    } catch (error) {
      resp.status(400).send("Invalid JSON");
    }
  });
}

/*
async function handler(req: Request, res: Response) {
  type responseData = {
    createdAt: string;
    ID: number;
  };

  const respBody: responseData = {
    createdAt: new Date().toISOString(),
    ID: 123,
  };

  res.header("Content-Type", "application/json");
  const body = JSON.stringify(respBody);
  res.status(200).send(body);
}
*/
