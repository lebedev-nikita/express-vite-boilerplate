import * as yup from "yup";

import { RequestHandler } from "../../lib/server";
import { getUserById, MAX_USER_ID, MIN_USER_ID } from "../../sensors/mock/user";

const schema = yup
  .object({
    user_id: yup.number().min(MIN_USER_ID).max(MAX_USER_ID).required(),
  })
  .required();

export const GET: RequestHandler = async ({ params }) => {
  const { user_id } = schema.validateSync(params);

  return getUserById(user_id);
};
