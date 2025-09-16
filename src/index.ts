import { handlerMetrics, handlerResetMetrics } from "./admin/metrics.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerValidateChirp } from "./api/validateChirp.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
  middlewareErrorHandler,
} from "./middleware/middlewareFuncs.js";

import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerResetMetrics);
app.post("/api/validate_chirp", handlerValidateChirp);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
