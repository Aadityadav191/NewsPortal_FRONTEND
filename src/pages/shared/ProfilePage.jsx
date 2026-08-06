import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Calendar,
  AlertCircle,
  X,
  CheckCircle2,
  KeyRound,
  Activity,
  Award,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initial = user?.name ? user.name[0].toUpperCase() : "U";

  // Role Badge Styling Map
  const getRoleBadge = (role) => {
    const formattedRole = role?.replace(/_/g, " ") || "Member";
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return {
          label: formattedRole,
          className: "bg-purple-50 text-purple-700 border-purple-200/80 ring-2 ring-purple-500/10",
        };
      case "AUTHOR":
        return {
          label: formattedRole,
          className: "bg-blue-50 text-blue-700 border-blue-200/80 ring-2 ring-blue-500/10",
        };
      default:
        return {
          label: formattedRole,
          className: "bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-2 ring-indigo-500/10",
        };
    }
  };

  const roleStyle = getRoleBadge(user?.role);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-6 p-2 sm:p-6"
    >
      {/* Dashboard Top Banner / Profile Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs"
      >
        <div className="absolute -right-12 -top-12 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar Container */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative group shrink-0"
          >
            {user?.avatar || user?.profileImage ? (
              <img
                src={user.avatar || user.profileImage}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md ring-1 ring-gray-100"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white text-4xl font-extrabold flex items-center justify-center shadow-md border-4 border-white ring-1 ring-gray-100">
                {initial}
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-xs"
              title="Account Active"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            </span>
          </motion.div>

          {/* User Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight truncate">
                {user?.name || "User Profile"}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${roleStyle.className}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {roleStyle.label}
              </span>
            </div>

            <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{user?.email || "No email provided"}</span>
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-200/60 text-emerald-700 px-3 py-1 rounded-lg font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Account Verified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200/70 text-gray-600 px-3 py-1 rounded-lg font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Pro Member
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="self-center sm:self-start pt-2 sm:pt-0 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutModal(true)}
              className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 font-semibold px-4 py-2.5 rounded-xl border border-rose-200/80 transition-colors text-xs cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Account Metric Overview Bar */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Status</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">Active Session</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Security</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">2FA Standard</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Permissions</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5 capitalize">
              {user?.role ? user.role.toLowerCase() : "Standard"} Tier
            </p>
          </div>
        </div>
      </motion.div>

      {/* Account Details Panel */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">Account Credentials & Meta</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            Overview of your system identity and role authorization settings.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-1 transition-shadow hover:shadow-xs"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name
            </div>
            <p className="text-gray-900 font-bold text-base">
              {user?.name || "N/A"}
            </p>
          </motion.div>

          {/* Email Address Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-1 transition-shadow hover:shadow-xs"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address
            </div>
            <p className="text-gray-900 font-bold text-base truncate">
              {user?.email || "N/A"}
            </p>
          </motion.div>

          {/* Role Permission Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-1 transition-shadow hover:shadow-xs"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> System Role
            </div>
            <p className="text-gray-900 font-bold text-base capitalize">
              {user?.role ? user.role.replace(/_/g, " ").toLowerCase() : "N/A"}
            </p>
          </motion.div>

          {/* Joining Date Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-1 transition-shadow hover:shadow-xs"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Member Since
            </div>
            <p className="text-gray-900 font-bold text-base">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Active Member"}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 relative z-10"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">Sign Out Confirmation</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Are you sure you want to log out of your session? You will need to sign in again to access protected administrative tools.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;