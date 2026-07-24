import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import AuthorDashboard from "../pages/author/AuthorDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import Home from "../pages/public/Home";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../pages/auth/signup";
import News from "../pages/public/News";
import Entertainment from "../pages/public/Entertainment";
import Finance from "../pages/public/Finance";
import Sports from "../pages/public/Sports";
import DashboardLayout from "../layouts/DashboardLayout";
import Unauthorized from "../pages/auth/unauthorized";
import NotFound from "../pages/auth/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/sports" element={<Sports />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      <Route path="/auth/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute allowedRoles={["AUTHOR"]} />}>
          <Route path="authors/dashboard" element={<AuthorDashboard />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}
        >
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route
            path="superadmin/dashboard"
            element={<SuperAdminDashboard />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
