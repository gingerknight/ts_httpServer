import { handlerMetrics, handlerResetData } from "./admin/metrics.js";
import { handlerReadiness } from "./api/readiness.js";
import {
  handlerChirps,
  handlerAllChirps,
  handlerGetChirp,
  handlerDeleteChirp,
} from "./api/chirps.js";
import { createNewUser } from "./api/createUsers.js";
import { handlerUserLogin } from "./api/userLogin.js";
import { handlerRefreshToken, handlerRevokeToken } from "./api/token.js";
import { handlerUpdateUser } from "./api/userUpdate.js";
import { handlerPolkaWebhook } from "./webhooks/webhooks.js";

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
app.get("/api/chirps", handlerAllChirps);
app.get("/api/chirps/:chirpID", handlerGetChirp);
app.post("/admin/reset", handlerResetData);
// app.post("/api/validate_chirp", handlerValidateChirp);
app.post("/api/chirps", handlerChirps);
app.post("/api/users", createNewUser);
app.post("/api/login", handlerUserLogin);
app.post("/api/refresh", handlerRefreshToken);
app.post("/api/revoke", handlerRevokeToken);
app.put("/api/users", handlerUpdateUser);
app.delete("/api/chirps/:chirpID", handlerDeleteChirp);
app.post("/api/polka/webhooks", handlerPolkaWebhook);

app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
