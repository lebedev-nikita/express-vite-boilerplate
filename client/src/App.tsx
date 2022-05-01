import { AppBar, Tab, Tabs, IconButton } from "@mui/material";
import { QuestionMark as QuestionMarkIcon } from "@mui/icons-material";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import Home from "./pages/Home";
import AnotherPage from "./pages/AnotherPage";

export default () => {
  const location = useLocation();

  return (
    <div className="h-screen w-screen flex">
      <AppBar className="flex flex-row justify-between items-center px-1.5">
        <Link to="/" className="flex flex-row items-center">
          <strong className="text-[2rem]">АББР</strong>
          <span className="inline-block ml-1 text-[0.9rem] leading-[0.9rem] ">
            Полное название <br /> витрины
          </span>
        </Link>
        <Tabs value={location.pathname} textColor="inherit" indicatorColor="secondary">
          <Tab component={Link} className="font-bold" label="Tab 1" value="/" to="/" />
          <Tab component={Link} className="font-bold" label="Tab 2" value="/tab2" to="/tab2" />
        </Tabs>
        <a href="https://google.com" target="_blank">
          <IconButton className="text-white">
            <QuestionMarkIcon />
          </IconButton>
        </a>
      </AppBar>
      <div className="w-full mt-6 p-2 bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tab2" element={<AnotherPage />} />
        </Routes>
      </div>
    </div>
  );
};
