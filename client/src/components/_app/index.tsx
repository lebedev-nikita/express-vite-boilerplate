import { Route, Routes, useLocation, Link } from "react-router-dom";

import { AppBar, Tab, Tabs } from "@mui/material";

import AnotherPage from "../pages/AnotherPage";
import Home from "../pages/Home";
import AppHelpIcon from "./AppHelpIcon";
import AppLogo from "./AppLogo";
import Notifications from "./Notifications";

export default () => {
  const location = useLocation();

  return (
    <div className="h-screen w-screen flex">
      <AppBar className="flex flex-row justify-between items-center px-1.5">
        <AppLogo abbr="АББР" firstLine="Полное название" secondLine="витрины" />
        <Tabs value={location.pathname} textColor="inherit" indicatorColor="secondary">
          <Tab component={Link} className="font-bold" label="Tab 1" value="/" to="/" />
          <Tab component={Link} className="font-bold" label="Tab 2" value="/tab2" to="/tab2" />
        </Tabs>
        <AppHelpIcon href="https://google.com" />
      </AppBar>
      <div className="w-full mt-[48px] p-2 bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tab2" element={<AnotherPage />} />
        </Routes>
      </div>
      <Notifications />
    </div>
  );
};
