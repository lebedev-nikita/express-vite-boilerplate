import * as yup from "yup";

import { getUserById, MAX_USER_ID, MIN_USER_ID } from "../../../sensors/mock/user";
import { RequestHandler } from "../../lib/file-routing";

const schema = yup
  .object({
    user_id: yup.number().min(MIN_USER_ID).max(MAX_USER_ID).required(),
  })
  .required();

export const get: RequestHandler = async (req) => {
  const { user_id } = schema.validateSync(req.query);

  return getUserById(user_id);
};
