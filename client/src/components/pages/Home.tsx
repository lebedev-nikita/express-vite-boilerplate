import { Link } from "react-router-dom";

import { Button, Paper } from "@mui/material";

import { useUrl } from "../../router";

export default () => {
  const url = useUrl("/");

  return (
    <div className="w-full h-full flex space-x-2">
      <Paper className="flex-none w-[350px]" />
      <Paper className="flex-none w-[600px] p-1 flex flex-col space-y-1">
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
