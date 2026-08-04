import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Home, WifiOff, HelpCircle } from "lucide-react";
import serverDownImg from "../assets/ServerDown.svg";

const ServerErrorState = ({ error }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className=" bg-white flex flex-col justify-center items-center p-4 sm:p-6 select-none font-sans relative overflow-hidden">
      <div className="w-full max-w-lg bg-white  backdrop-blur-md rounded-3xl p-8 sm:p-10  relative z-10 text-center flex flex-col items-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wide uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Connection Interrupted
        </div>

        {/* SVG Illustration */}
        <div className="w-full max-w-55 sm:max-w-65 h-auto mb-6 drop-shadow-lg transition-transform duration-500 hover:scale-105">
          <img
            src={serverDownImg}
            alt="Server Down Illustration"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>

        {/* Text Details */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2a3143] mb-2 font-serif">
          Unable to Connect to Server
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
          {error ||
            "We're having trouble fetching the latest news stories. The server might be offline or updating."}
        </p>

        {/* Subtle Footer Help Note */}
        <div className="pt-6 border-t border-slate-800/80 w-full flex items-center justify-center gap-2 text-xs text-slate-500">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Check your internet or try again in a few minutes.</span>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorState;
