import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardHeader = () => {
  const { user } = useAuth();

  // 1. Dynamic configuration based on the user's role
  const roleConfigs = {
    superadmin: {
      title: "System Master Control",
      description: "Full oversight of the publication pipeline. You can manage roles, override system configurations, delete articles, and audit all platform activity logs.",
      badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
      bannerBg: "from-purple-900 to-indigo-950",
      accentText: "text-purple-300"
    },
    admin: {
      title: "Editorial Administration",
      description: "Manage system categories, review reported text queues, and moderate submissions across all columns. You hold publishing, editing, and architectural access rights.",
      badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
      bannerBg: "from-slate-900 to-blue-950",
      accentText: "text-blue-300"
    },
    author: {
      title: "Writer Workspace Portal",
      description: "Draft, edit, and organize your personal news articles. Monitor your view matrix analytics, assign categories, and update your published coverage streams.",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      bannerBg: "from-slate-900 to-emerald-950",
      accentText: "text-emerald-300"
    }
  };

  // Fallback default config if role matching catches an unassigned string
  const currentConfig = roleConfigs[user?.role] || {
    title: "News Management Interface",
    description: "Welcome to the news portal workflow area. Access tools corresponding to your assigned system roles below.",
    badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
    bannerBg: "from-slate-800 to-slate-950",
    accentText: "text-slate-400"
  };

  return (
    <div className={`w-full bg-linear-to-r ${currentConfig.bannerBg} text-white shadow-md border-b border-slate-800 overflow-hidden relative`}>
      
      {/* Decorative ambient background design accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Main textual portal brand summary */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                NewsPortal Engine v2.0
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide border rounded-md ${currentConfig.badgeBg}`}>
                {user?.role || 'Guest'} Mode
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
              {currentConfig.title}
            </h1>
            
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {currentConfig.description}
            </p>
          </div>

          {/* Quick Actions & Role Health Stats */}
<div className="grid grid-cols-2 gap-3 min-w-70">
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10 flex flex-col justify-between">
    <span className="text-[10px] text-slate-300 uppercase font-semibold tracking-wider">
      System Status
    </span>
    <div className="flex items-center gap-2 mt-1">
      <span className="text-sm font-bold text-white">API Connected</span>
    </div>
  </div>

  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10 flex flex-col justify-between">
    <span className="text-[10px] text-slate-300 uppercase font-semibold tracking-wider">
      Role Permission
    </span>
    <span className={`text-sm font-bold mt-1 uppercase ${currentConfig.accentText}`}>
      {user?.role === 'superadmin' ? 'Root Access' : user?.role === 'admin' ? 'Write/Edit' : 'Draft Only'}
    </span>
  </div>

  <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10 flex flex-col justify-between col-span-2">
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-300">Logged in as:</span>
      <span className="font-semibold text-white truncate max-w-37.5">{user?.name}</span>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;