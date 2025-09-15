import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware/middlewareFuncs.js";

import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
