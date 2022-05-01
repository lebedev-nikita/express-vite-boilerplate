import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { LocalizationProvider } from "@mui/lab";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import App from "./App";
import "./public/index.css";
import { store } from "./redux/store";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#FFF",
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiSnackbar: {
      defaultProps: {
        autoHideDuration: 10_000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      },
    },
    MuiAlert: {
      defaultProps: {
        elevation: 6,
        variant: "filled",
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Provider store={store}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </Provider>
      </BrowserRouter>
    </LocalizationProvider>
  </ThemeProvider>
);
