// auth/AuthLayout.tsx
import { Outlet, Link } from "react-router-dom";
import "./style.css"

export default function AuthLayout() {
  return (
    <div>
      <h1>Auth</h1>

      <nav>
        <Link to="./login">Login</Link>{" | "}
        <Link to="./register">Register</Link>{" | "}
        <Link to="./recover">Recover</Link>
      </nav>

      <Outlet />
    </div>
  );
}
