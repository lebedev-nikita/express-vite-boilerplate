import express from "express";
import { resolve } from "path";
import { createRouter } from "./lib/file-routing";

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();

app.use("/api", createRouter(resolve(__dirname, "api")));

app.listen(SERVER_PORT, () => {
  console.log(`server is listening on http://localhost:${SERVER_PORT}`);
});
