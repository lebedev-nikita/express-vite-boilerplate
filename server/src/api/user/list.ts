import { RequestHandler } from "../../lib/server";
import { listUsers } from "../../sensors/mock/user";

export const POST: RequestHandler = async () => {
  return listUsers();
};
