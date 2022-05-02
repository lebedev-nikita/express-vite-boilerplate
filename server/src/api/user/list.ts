import { listUsers } from "../../../sensors/mock/user";
import { RequestHandler } from "../../lib/file-routing";

export const get: RequestHandler = async () => {
  return listUsers();
};
