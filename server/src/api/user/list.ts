import { RequestHandler } from "../../lib/server";
import { listUsers } from "../../sensors/mock/user";

export const GET: RequestHandler = async () => {
  return listUsers();
};

export const POST = GET;
