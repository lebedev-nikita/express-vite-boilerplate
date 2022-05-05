import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

import errorTransmitter from "./util/errorTransmitter";

interface Handlers {
  get?: (any) => Promise<any>;
  post?: (any) => Promise<any>;
  default?: (any) => Promise<any>;
}

export default (apiDir: string, getProps: (req, res) => any) => {
  const router = Router();

  router.use("/", async (req: Request, res: Response) => {
    const handlers = await resolveHandlers(apiDir, req.path);
    let ret: any;

    try {
      if (req.method == "GET" && "get" in handlers) {
        ret = await handlers.get!(getProps(req, res));
      } else if (req.method == "POST" && "post" in handlers) {
        ret = await handlers.post!(getProps(req, res));
      } else if ("default" in handlers) {
        ret = await handlers.default!(getProps(req, res));
      } else {
        return void res.sendStatus(400);
      }
    } catch (error) {
      errorTransmitter.setError(req, res, error);
      return res.status(500).json({ error_message: error.message });
    }

    if (ret !== undefined && !res.headersSent) {
      return res.json(ret);
    }
  });

  return router;
};

const resolveHandlers = async (apiDir: string, reqPath: string): Promise<Handlers> => {
  let filePath = apiDir;

  if (reqPath !== "/") {
    if (reqPath.endsWith("/")) {
      filePath = path.resolve(filePath, ...reqPath.slice(1, -1).split("/"));
    } else {
      filePath = path.resolve(filePath, ...reqPath.slice(1).split("/"));
    }
  }

  const pathVariants = [
    filePath + ".ts",
    filePath + ".js",
    path.resolve(filePath, "index.ts"),
    path.resolve(filePath, "index.js"),
  ];

  for (const file of pathVariants) {
    if (fs.existsSync(file)) {
      return await import(file);
    }
  }

  return {};
};
