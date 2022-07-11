import { Request, Response } from "express";

import auth from "./auth";

export interface RequestProps {
  user_id: string;
  params: Record<string, any>;
  req: Request;
  res: Response;
}

export type RequestHandler = (props: RequestProps) => any;

export const getProps = (req: Request, res: Response): RequestProps => {
  const params = {
    ...req.query,
    ...(req.headers["content-type"] == "application/json" && req.body),
  };
  const user_id = auth.getUserId(req, res) ?? "";

  return { params, req, res, user_id };
};
