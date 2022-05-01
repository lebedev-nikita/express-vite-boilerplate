import * as yup from "yup";

import { RequestHandler } from "../lib/file-routing";

const schema = yup
  .object({
    id: yup.number().required(),
    data: yup.string().required(),
  })
  .required();

export const get: RequestHandler = async (req) => {
  const params = schema.validateSync(req.query);
  console.log(req.query);

  const names = ["John", "Mike", "Alex"];

  return {
    name: names[params.id % 3],
    id: params.id,
    data: params.data,
  };
};
