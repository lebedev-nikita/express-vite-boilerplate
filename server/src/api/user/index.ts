import * as yup from "yup";

import { getUserById, MAX_USER_ID, MIN_USER_ID } from "../../../sensors/mock/user";
import { RequestProps } from "../../lib/server";

const schema = yup
  .object({
    user_id: yup.number().min(MIN_USER_ID).max(MAX_USER_ID).required(),
  })
  .required();

export const get = async ({ params }: RequestProps) => {
  const { user_id } = schema.validateSync(params);

  return getUserById(user_id);
};
