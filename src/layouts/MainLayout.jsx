import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';

export default function MainLayout() {
   const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <>
     <TopBar/>
     {/* Newsroom Top Date & Breaking Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-extrabold uppercase px-2 py-0.5 rounded-xs tracking-wider text-[10px]">
              Live
            </span>
            <span className="text-slate-300 font-medium truncate">
              Continuous editorial coverage updated around the clock.
            </span>
          </div>
          <div className="text-slate-400 font-medium shrink-0">{currentDate}</div>
        </div>
      </div>
      <Navbar/>
      <Outlet />
    </>
  );
}
