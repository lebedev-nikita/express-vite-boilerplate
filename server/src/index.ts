import express from "express";
import path from "path";

import { logger } from "./lib/logger";
import serverLogger from "./lib/logger/serverLogger";
import { configureServer } from "./lib/server";

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

configureServer(app, {
  apiDir: path.resolve(__dirname, "api"),
  writeLogs: serverLogger,
});

if (process.env.MODE == "production") {
  app.use("/", express.static(path.resolve(__dirname, "../../client/dist")));
}

app.listen(SERVER_PORT, () => {
  logger.info(`server is listening on http://localhost:${SERVER_PORT}`);
});
