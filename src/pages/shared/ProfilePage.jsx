import React, { useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Sparkles,
  Calendar,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initial = user?.name ? user.name[0].toUpperCase() : "U";

  // Helper to get role badge styling dynamically
  const getRoleBadge = (role) => {
    const formattedRole = role?.replace(/_/g, " ") || "Member";
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return {
          label: formattedRole,
          className: "bg-purple-50 text-purple-700 border-purple-200/60",
        };
      case "AUTHOR":
        return {
          label: formattedRole,
          className: "bg-blue-50 text-blue-700 border-blue-200/60",
        };
      default:
        return {
          label: formattedRole,
          className: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
        };
    }
  };

  const roleStyle = getRoleBadge(user?.role);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-2 sm:p-4">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar Container */}
          <div className="relative group">
            {user?.avatar || user?.profileImage ? (
              <img
                src={user.avatar || user.profileImage}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white text-4xl font-extrabold flex items-center justify-center shadow-md border-4 border-white">
                {initial}
              </div>
            )}
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Active Account" />
          </div>

          {/* User Basic Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight truncate">
                {user?.name || "User Profile"}
              </h1>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-xs ${roleStyle.className}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {roleStyle.label}
              </span>
            </div>
            
            <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email || "No email provided"}
            </p>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400 font-medium">
              <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Account Verified
              </span>
            </div>
          </div>

          {/* Sign Out Trigger Button */}
          <div className="self-center sm:self-start pt-2 sm:pt-0">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 font-semibold px-4 py-2.5 rounded-xl border border-rose-100 transition-colors text-xs"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Account Details</h3>
          <p className="text-gray-500 text-xs mt-0.5">Your personal information and role permissions.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name Card */}
          <div className="p-4 bg-gray-50/70 border border-gray-100/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <User className="w-3.5 h-3.5" /> Full Name
            </div>
            <p className="text-gray-900 font-bold text-base">
              {user?.name || "N/A"}
            </p>
          </div>

          {/* Email Address Card */}
          <div className="p-4 bg-gray-50/70 border border-gray-100/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </div>
            <p className="text-gray-900 font-bold text-base truncate">
              {user?.email || "N/A"}
            </p>
          </div>

          {/* Role Permission Card */}
          <div className="p-4 bg-gray-50/70 border border-gray-100/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Access Role
            </div>
            <p className="text-gray-900 font-bold text-base capitalize">
              {user?.role ? user.role.replace(/_/g, " ").toLowerCase() : "N/A"}
            </p>
          </div>

          {/* Joining Date or Extra Spec Card */}
          <div className="p-4 bg-gray-50/70 border border-gray-100/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Member Since
            </div>
            <p className="text-gray-900 font-bold text-base">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Member"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900">Sign Out Confirmation</h3>
              <p className="text-gray-500 text-sm">
                Are you sure you want to log out of your session? You will need to sign in again to access protected tools.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;