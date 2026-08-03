import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Shared & Specific Pages
import ManageAdmin from "../pages/super-admin/ManageAdmin";
import ManageAuthor from "../pages/super-admin/ManageAuthor";
import ManageArticles from "../pages/super-admin/ManageArticles";
import ProfilePage from "../pages/shared/ProfilePage";

// Author Pages
import CreateArticlePage from "../pages/author/CreateArticlePage";
import MyArticlesPage from "../pages/author/MyArticlesPage";

// Public & Auth Pages
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/signup";
import NotFound from "../pages/auth/NotFound";
import UnifiedDashboardPage from "../pages/shared/UnifiedDashboardPage";
import ArticleDetails from "../pages/public/ArticleDetails";
import News from "../pages/public/News";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/news" element={<News/>} />
         <Route path="/article/:slug" element={<ArticleDetails/>} />
      </Route>

      {/* Auth Pages */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Dashboard Routes with Sidebar */}
      <Route element={<DashboardLayout />}>
        {/* Author Routes */}
        <Route element={<ProtectedRoute allowedRoles={["AUTHOR"]} />}>
          <Route path="authors/dashboard" element={<UnifiedDashboardPage />} />
          <Route path="authors/create-article" element={<CreateArticlePage />}/>
          <Route path="authors/my-articles" element={<MyArticlesPage />} />
          <Route path="authors/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}>
          <Route path="admin/dashboard" element={<UnifiedDashboardPage />} />
          <Route path="admin/authors" element={<ManageAuthor />} />
          <Route path="admin/articles" element={<ManageArticles />} />
          <Route path="admin/profile" element={<ProfilePage />} />
        </Route>

        {/* Super Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route
            path="superadmin/dashboard"
            element={<UnifiedDashboardPage />}
          />
          <Route path="superadmin/admins" element={<ManageAdmin />} />
          <Route path="superadmin/authors" element={<ManageAuthor />} />
          <Route path="superadmin/articles" element={<ManageArticles />} />
          <Route path="superadmin/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
