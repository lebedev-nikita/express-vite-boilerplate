import { RequestHandler } from "../lib/file-routing";
import * as yup from "yup";

const schema = yup
  .object({
    id: yup.number().required(),
    data: yup.string().required(),
  })
  .required();

export const get: RequestHandler = async (req) => {
  const params = schema.validateSync(req.query);

  const names = ["John", "Mike", "Alex"];

  return {
    name: names[params.id % 3],
    id: params.id,
    data: params.data,
  };
};
