import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { withErrorNotifications } from "./_util";

export interface UserInfo {
  name: string;
  user_id: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: withErrorNotifications(fetchBaseQuery({ baseUrl: "/api/user" })),
  endpoints: (builder) => ({
    getUser: builder.query<UserInfo, { user_id: string | number }>({
      query: ({ user_id }) => ({
        url: "/",
        params: { user_id },
      }),
    }),
    listUsers: builder.query<UserInfo[], void>({
      query: () => "/list",
    }),
  }),
});

export const { useGetUserQuery, useListUsersQuery } = userApi;
