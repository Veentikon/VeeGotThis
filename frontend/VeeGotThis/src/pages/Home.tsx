import { Outlet } from "react-router-dom";
import MyAppBar from "../components/TopAppBar";
import "./Home.css";
import "../index.css"
// import Toolbar from "@mui/material/Toolbar";

export default function Home() {
  return (
    <div className="page">
      <MyAppBar />
      {/* <Toolbar /> */}
      <div className="appbar-spacer"></div>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

