import { listUsers } from "../../../sensors/mock/user";

export const get = async () => {
  return listUsers();
};
