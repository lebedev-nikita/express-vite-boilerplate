import { Request } from "express";

import { getLogger } from "..";
import { getInfo, pg } from "./_stat";

const errLogger = getLogger("error");
const reqLogger = getLogger("request");

interface Props {
  req: Request;
  query_time: number;
  user_id: string;
  error?: Error;
}

if (process.env.SERVER_STAT_PG == "true") {
  pg.init();
}

export default ({ req, user_id, query_time, error }: Props) => {
  const info = getInfo(req, user_id, query_time);

  reqLogger.info(info);
  if (error) {
    errLogger.error(error);
  }

  if (process.env.SERVER_STAT_PG == "true") {
    pg.log(info, error);
  }
};
