import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <DashboardHeader onMenuClick={() => setIsMobileOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
