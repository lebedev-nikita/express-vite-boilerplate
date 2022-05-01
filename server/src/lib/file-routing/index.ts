import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// TODO: добавить автовыведение типа вместо 'any'
export type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

interface Handlers {
  get?: RequestHandler;
  post?: RequestHandler;
  default?: RequestHandler;
}

const resolveHandlers = async (directory: string, reqPath: string): Promise<Handlers> => {
  let filePath = directory;

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

export const createFileRouter = (directory: string) => {
  const router = Router();

  router.use("/", async (req, res, next) => {
    const handlers = await resolveHandlers(directory, req.path);
    let ret: any;

    try {
      if (req.method == "GET" && "get" in handlers) {
        ret = await handlers.get(req, res, next);
      } else if (req.method == "POST" && "post" in handlers) {
        ret = await handlers.post(req, res, next);
      } else if ("default" in handlers) {
        ret = await handlers.default(req, res, next);
      } else {
        return void res.sendStatus(400);
      }
    } catch (error) {
      console.error(error);
      return void res.status(500).json({ error: error.message });
    }

    if (ret !== undefined) {
      return void res.json(ret);
    }
  });

  return router;
};
