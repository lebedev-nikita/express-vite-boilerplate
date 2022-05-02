import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Paper, TextField, Typography } from "@mui/material";

import { useGetUserQuery, useListUsersQuery } from "../../redux/api/userApi";
import { useUrl } from "../../router";

export default () => {
  const url = useUrl("/");
  const [userId, setUserId] = useState("0");

  const { isSuccess, isError, data: user, error } = useGetUserQuery({ user_id: userId });
  const { data: users } = useListUsersQuery();

  return (
    <div className="w-full h-full flex space-x-2">
      <Paper className="flex-none w-[350px] p-1 space-y-1">
        <Typography variant="h5">RTK Demo</Typography>
        <div className="border-2 p-1">
          <TextField
            type="number"
            label="user_id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <pre>{isSuccess && JSON.stringify(user, null, 2)}</pre>
          <pre>{isError && JSON.stringify({ error }, null, 2)}</pre>
        </div>
        <div className="border-2 p-1">
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
      </Paper>
      <Paper className="flex-none w-[450px] p-1 flex flex-col space-y-1">
        <Typography variant="h5">Router Demo</Typography>
        <pre>{JSON.stringify(url.query, null, 2)}</pre>
        <Link to={url.setQuery({ urlParam_2: "CHANGED_BY_BUTTON" })}>
          <Button>change param 2</Button>
        </Link>
        <Link to={url.reset("/")}>
          <Button>Reset params</Button>
        </Link>
      </Paper>
      <Paper className="flex-auto" />
    </div>
  );
};
