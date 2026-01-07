// Home.jsx
import { Outlet } from "react-router-dom";
import MyAppBar from "../components/TopAppBar";

export default function Home() {
  return (
    <>
      <MyAppBar />
      <main style={{ padding: 16, marginTop: 64 }}>
        <Outlet />
      </main>
    </>
  );
}
