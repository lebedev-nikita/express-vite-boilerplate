import express from "express";
import path from "path";
import { authMiddleware } from "./lib/auth";
import { createFileRouter } from "./lib/file-routing";

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

if (process.env.SERVER_AUTH == "true") {
  app.use(authMiddleware);
}

app.use("/api", createFileRouter(path.resolve(__dirname, "api")));

app.listen(SERVER_PORT, () => {
  console.log(`server is listening on http://localhost:${SERVER_PORT}`);
});
