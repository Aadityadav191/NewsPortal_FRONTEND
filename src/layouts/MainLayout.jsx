import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';

export default function MainLayout() {
  return (
    <>
     <TopBar/>
      <Navbar/>
      <Outlet />
    </>
  );
}
