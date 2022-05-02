import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

import { setError } from "../common";

type BQ = ReturnType<typeof fetchBaseQuery>;

export const withErrorNotifications =
  (baseQuery: BQ): BQ =>
  async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error) {
      const status = result.error.status;
      const url = result.meta?.request.url ?? "";
      const { error_message = "" } = (result.error.data as any) ?? {};
      api.dispatch(setError(`Ошибка ${status} : ${url} : ${error_message}`));
    }
    return result;
  };
