import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { LocalizationProvider } from "@mui/lab";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import App from "./App";
import "./public/index.css";

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
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </LocalizationProvider>
  </ThemeProvider>
);
