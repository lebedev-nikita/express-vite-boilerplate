import { Router, Request, Response } from "express";
import fs from "fs";

import errorTransporter from "./util/errorTransporter";
import { getProps, RequestHandler, RequestProps } from "./util/getProps";

export default (apiDir: string) => {
  const router = Router();

  router.use("/", async (req: Request, res: Response) => {
    try {
      const handlerPath = apiDir + req.path;
      const ret = await handleRequest(req.method, handlerPath, getProps(req, res));
      if (ret !== undefined && !res.headersSent) {
        res.json(ret);
      }
    } catch (error) {
      errorTransporter.setError(req, res, error);
      if (error.message == "404") {
        res.sendStatus(404);
        return;
      }
      res.status(500).json({ error_message: error.message });
    }
  });

  return router;
};

const handleRequest = async (method: string, handlerPath: string, props: RequestProps) => {
  if (handlerPath.endsWith("/")) {
    handlerPath = handlerPath.slice(0, -1);
  }

  const pathVariants = [
    handlerPath + ".ts",
    handlerPath + ".js",
    handlerPath + "/index.ts",
    handlerPath + "/index.js",
  ];

  for (const file of pathVariants) {
    if (fs.existsSync(file)) {
      const handlers = await import(file);
      const handler = handlers[method] as RequestHandler | undefined;
      if (handler === undefined) break;
      return await handler(props);
    }
  }

  throw new Error("404");
};
