// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// // import App from './App.tsx'
// // import AuthPage from './pages/AuthPage.tsx'
// import App from './App.tsx'
// import { createBrowserRouter, RouterProvider } from "react-router-dom"

// const router = createBrowserRouter([
//   {path: '/', element: <App />}
// ]);

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AuthLayout from "./auth/AuthLayout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import RecoverPassword from "./auth/Recover";

import ProtectedRoute from "./routes/ProtectedRoute";
// import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

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
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
