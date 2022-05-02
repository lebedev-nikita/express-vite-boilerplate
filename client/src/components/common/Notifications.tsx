import { useEffect } from "react";

import { Alert, Snackbar } from "@mui/material";

import { setError, setInfo } from "../../redux/common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default () => {
  const dispatch = useAppDispatch();

  const error = useAppSelector((s) => s.common.error);
  const info = useAppSelector((s) => s.common.info);

  const closeError = () => dispatch(setError(""));
  const closeInfo = () => dispatch(setInfo(""));

  return (
    <>
      <Snackbar open={!!error}>
        <Alert severity="error" onClose={closeError}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!info}>
        <Alert severity="info" onClose={closeInfo}>
          {info}
        </Alert>
      </Snackbar>
    </>
  );
};
