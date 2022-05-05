import { Request, Response } from "express";

export default {
  setError(req: Request, res: Response, error: Error) {
    res.locals.error = error;
  },
  getError(req, res): Error | undefined {
    return res.locals.error;
  },
};
