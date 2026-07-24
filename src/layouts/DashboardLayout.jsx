import React from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

export default function DashboardLayout() {
  return (
    <>
      <DashboardHeader />
      <Outlet />
    </>
  );
}
