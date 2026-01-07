// main.tsx
// Functional Imports
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Authentication routes
import AuthLayout from "./auth/AuthLayout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import RecoverPassword from "./auth/Recover";

// Protected routes
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Todos from "./pages/Todos";
import Dashboard from "./pages/Dashboard";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="recover" element={<RecoverPassword />} />
          </Route>

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />}>
              <Route path="/todos" element={<Todos />} />
              <Route path="/events" element={<Events />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
