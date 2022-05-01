import { Paper } from "@mui/material";

export default () => {
  return (
    <div className="w-full h-full flex space-x-2">
      <Paper className="flex-none w-[350px]" />
      <Paper className="flex-none w-[600px]" />
      <Paper className="flex-auto" />
    </div>
  );
};
