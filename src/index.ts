import { handlerMetrics, handlerResetData } from "./admin/metrics.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerValidateChirp } from "./lib/validation/validateChirp.js";
import { handlerChirps } from "./api/chirps.js";
import { createNewUser } from "./api/createUsers.js";

import {
  middlewareLogResponses,
  middlewareMetricsInc,
  middlewareErrorHandler,
} from "./middleware/middlewareFuncs.js";
import { config } from "./config.js";

import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

const app = express();
app.use(express.json({ limit: "1mb" }));

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerResetData);
// app.post("/api/validate_chirp", handlerValidateChirp);
app.post("/api/chirps", handlerChirps);
app.post("/api/users", createNewUser);

app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
