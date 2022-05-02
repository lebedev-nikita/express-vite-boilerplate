import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export type RequestHandler = (params: RequestProps) => Promise<any>;

interface Handlers {
  get?: RequestHandler;
  post?: RequestHandler;
  default?: RequestHandler;
}

export interface RequestProps {
  user_id: string;
  params: Record<string, any>;
  req: Request;
  res: Response;
}

const prepareRequestProps = (req: Request, res: Response): RequestProps => {
  let params = {};
  if (req.query) {
    params = { ...params, ...req.query };
  }
  if (req.body && req.headers["content-type"] == "application/json") {
    params = { ...params, ...req.body };
  }
  return { params, req, res, user_id: req.cookies.login };
};

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

  router.use("/", async (req, res) => {
    const handlers = await resolveHandlers(directory, req.path);
    let ret: any;

    try {
      const requestProps = prepareRequestProps(req, res);

      if (req.method == "GET" && "get" in handlers) {
        ret = await handlers.get(requestProps);
      } else if (req.method == "POST" && "post" in handlers) {
        ret = await handlers.post(requestProps);
      } else if ("default" in handlers) {
        ret = await handlers.default(requestProps);
      } else {
        return void res.sendStatus(400);
      }
    } catch (error) {
      console.error(error);
      return void res.status(500).json({ error_message: error.message });
    }

    if (ret !== undefined) {
      return void res.json(ret);
    }
  });

  return router;
};
