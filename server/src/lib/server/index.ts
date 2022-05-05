import cookieParser from "cookie-parser";
import express, { Request, Response, Express } from "express";
import responseTime from "response-time";

import fsRouter from "./fsRouter";
import auth from "./util/auth";
import errorTransmitter from "./util/errorTransmitter";
import { getProps } from "./util/getProps";

export type { RequestProps } from "./util/getProps";

export interface ServerOptions {
  apiDir: string;
  writeLogs?: (p: { req: Request; query_time: number; user_id?: string; error? }) => any;
}

export const configureServer = (app: Express, { apiDir, writeLogs }: ServerOptions) => {
  const needAuth = process.env.SERVER_AUTH == "true";

  return app
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded({ extended: true, inflate: true }))
    .use((req, res, next) => (needAuth ? auth.middleware(req, res, next) : next()))
    .use(
      responseTime((req: Request, res: Response, query_time) => {
        const user_id = auth.getUserId(req, res);
        const error = errorTransmitter.getError(req, res);
        writeLogs?.({ req, query_time, user_id, error });
      })
    )
    .use("/api", fsRouter(apiDir, getProps));
};
