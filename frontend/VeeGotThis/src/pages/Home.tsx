import { Outlet } from "react-router-dom";
import MyAppBar from "../components/TopAppBar";
import "./Home.css";

export default function Home() {
  return (
    <div className="page">
      <MyAppBar />

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

