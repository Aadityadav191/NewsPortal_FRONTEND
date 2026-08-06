import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// Services
import {
  PublishedArticles,
  ApprovedAuthor,
  ApprovedAdmin,
} from "../../api/services/published.service";
import {
  getPendingAuthors,
  getPendingArticles,
} from "../../api/services/admin.service";
import { getPendingAdmins } from "../../api/services/superadmin.service";
import { getMyArticles } from "../../api/services/author.service";

// Motion Variants
const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const UnifiedDashboardPage = () => {
  const { user } = useAuth();

  // Role Checks
  const userRole = (user?.role || "").toUpperCase();
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isAdmin = userRole === "ADMIN";
  const isAuthor = userRole === "AUTHOR";
  const isAdminOrSuperAdmin = isSuperAdmin || isAdmin;

  // Stats State
  const [stats, setStats] = useState({
    publishedArticles: 0,
    approvedAuthors: 0,
    approvedAdmins: 0,
    pendingAdmins: 0,
    pendingAuthors: 0,
    pendingArticles: 0,
    myTotalArticles: 0,
    myPublishedArticles: 0,
    myPendingArticles: 0,
    myRejectedArticles: 0,
  });

  // Approved Staff Directory (Fetched from API)
  const [approvedMembers, setApprovedMembers] = useState([]);

  // Recent Items Lists
  const [recentPendingAuthors, setRecentPendingAuthors] = useState([]);
  const [recentPendingArticles, setRecentPendingArticles] = useState([]);
  const [authorArticlesList, setAuthorArticlesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Directory filter state (for Admins/SuperAdmins)
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    fetchDashboardData();
  }, [userRole]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (isAdminOrSuperAdmin) {
        const promises = [
          PublishedArticles(), // [0]
          getPendingAuthors(), // [1]
          getPendingArticles(), // [2]
          ApprovedAuthor(), // [3]
          ApprovedAdmin(), // [4]
        ];

        if (isSuperAdmin) {
          promises.push(getPendingAdmins()); // [5] Pending admin registrations
        }

        const results = await Promise.allSettled(promises);

        // Extract Response Data Safely
        const publishedRes =
          results[0].status === "fulfilled" ? results[0].value.data : null;
        const pendingAuthorsRes =
          results[1].status === "fulfilled" ? results[1].value.data : null;
        const pendingArticlesRes =
          results[2].status === "fulfilled" ? results[2].value.data : null;
        const approvedAuthorsRes =
          results[3].status === "fulfilled" ? results[3].value.data : null;
        const approvedAdminsRes =
          results[4].status === "fulfilled" ? results[4].value.data : null;
        const pendingAdminsRes =
          isSuperAdmin && results[5]?.status === "fulfilled"
            ? results[5].value.data
            : null;

        // Extract Lists safely handling nested structures
        const publishedList =
          publishedRes?.data?.data ||
          publishedRes?.data ||
          (Array.isArray(publishedRes) ? publishedRes : []);

        const pendingAuthorsList =
          pendingAuthorsRes?.authors ||
          pendingAuthorsRes?.data ||
          (Array.isArray(pendingAuthorsRes) ? pendingAuthorsRes : []);

        const pendingArticlesList =
          pendingArticlesRes?.articles ||
          pendingArticlesRes?.data ||
          (Array.isArray(pendingArticlesRes) ? pendingArticlesRes : []);

        const approvedAuthorsList =
          approvedAuthorsRes?.authors ||
          approvedAuthorsRes?.data ||
          (Array.isArray(approvedAuthorsRes) ? approvedAuthorsRes : []);

        const approvedAdminsList =
          approvedAdminsRes?.admins ||
          approvedAdminsRes?.data ||
          (Array.isArray(approvedAdminsRes) ? approvedAdminsRes : []);

        const pendingAdminsList =
          pendingAdminsRes?.admins ||
          pendingAdminsRes?.data ||
          (Array.isArray(pendingAdminsRes) ? pendingAdminsRes : []);

        // Normalize staff list format for directory table
        const formattedAuthors = approvedAuthorsList.map((item) => ({
          id: item._id || item.id,
          name: item.name || item.fullName || "Unknown Author",
          email: item.email || "N/A",
          role: (item.role || "AUTHOR").toUpperCase(),
          joinedAt: item.createdAt
            ? new Date(item.createdAt).toISOString().split("T")[0]
            : "N/A",
          status: "ACTIVE",
        }));

        const formattedAdmins = approvedAdminsList.map((item) => ({
          id: item._id || item.id,
          name: item.name || item.fullName || "Unknown Admin",
          email: item.email || "N/A",
          role: (item.role || "ADMIN").toUpperCase(),
          joinedAt: item.createdAt
            ? new Date(item.createdAt).toISOString().split("T")[0]
            : "N/A",
          status: "ACTIVE",
        }));

        // Combine and set approved directory members
        setApprovedMembers([...formattedAdmins, ...formattedAuthors]);

        // Update Dashboard Metrics
        setStats((prev) => ({
          ...prev,
          publishedArticles: publishedList.length,
          approvedAuthors: approvedAuthorsList.length,
          approvedAdmins: approvedAdminsList.length,
          pendingAuthors: pendingAuthorsList.length,
          pendingArticles: pendingArticlesList.length,
          pendingAdmins: pendingAdminsList.length,
        }));

        setRecentPendingAuthors(pendingAuthorsList.slice(0, 3));
        setRecentPendingArticles(pendingArticlesList.slice(0, 3));
      } else if (isAuthor) {
        // Fetch personal articles for Author role
        const res = await getMyArticles();
        const articlesList =
          res?.data?.articles || res?.data || (Array.isArray(res) ? res : []);

        const published = articlesList.filter((a) =>
          ["APPROVED", "PUBLISHED"].includes((a.status || "").toUpperCase())
        ).length;
        const pending = articlesList.filter(
          (a) => (a.status || "PENDING").toUpperCase() === "PENDING"
        ).length;
        const rejected = articlesList.filter(
          (a) => (a.status || "").toUpperCase() === "REJECTED"
        ).length;

        setStats((prev) => ({
          ...prev,
          myTotalArticles: articlesList.length,
          myPublishedArticles: published,
          myPendingArticles: pending,
          myRejectedArticles: rejected,
        }));

        setAuthorArticlesList(articlesList.slice(0, 5));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovedMembers = approvedMembers.filter((member) => {
    if (roleFilter === "ALL") return true;
    return member.role === roleFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* WELCOME BANNER (ALL ROLES) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative"
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Role: {userRole.replace("_", " ")}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || user?.email || "User"}!
          </h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl">
            {isAdminOrSuperAdmin
              ? "Platform administration hub. Review pending requests, published stories, and active staff."
              : "Author workspace. Create new drafts, manage submissions, and check publishing status."}
          </p>
        </div>

        {/* Dynamic Context Buttons */}
        <div className="flex flex-wrap gap-3 relative z-10">
          {isAuthor && (
            <Link
              to="/authors/create-article"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Write New Article
            </Link>
          )}

          {isAdminOrSuperAdmin && (
            <>
              <Link
                to={isSuperAdmin ? "/superadmin/articles" : "/admin/articles"}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition"
              >
                Review Articles
              </Link>
              <Link
                to={isSuperAdmin ? "/superadmin/authors" : "/admin/authors"}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
              >
                Manage Authors
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* METRICS CARDS SECTION */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* --- ADMIN / SUPER ADMIN METRICS --- */}
        {isAdminOrSuperAdmin && (
          <>
            {/* Published Articles Metric */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Published Articles
                </p>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                  {loading ? "..." : stats.publishedArticles}
                </h2>
                <span className="text-[11px] text-emerald-600 font-medium mt-2 block">
                  Live on platform
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Approved Authors Metric */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Approved Authors
                </p>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                  {loading ? "..." : stats.approvedAuthors}
                </h2>
                <span className="text-[11px] text-blue-600 font-medium mt-2 block">
                  Active content creators
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Pending Articles Metric */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Pending Articles
                </p>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                  {loading ? "..." : stats.pendingArticles}
                </h2>
                <Link
                  to={isSuperAdmin ? "/superadmin/articles" : "/admin/articles"}
                  className="text-xs font-medium text-amber-600 hover:text-amber-700 mt-2 inline-block"
                >
                  Review queue &rarr;
                </Link>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Approved Admins / Pending Authors Dynamic Metric */}
            {isSuperAdmin ? (
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Approved Admins
                  </p>
                  <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                    {loading ? "..." : stats.approvedAdmins}
                  </h2>
                  <span className="text-[11px] text-purple-600 font-medium mt-2 block">
                    Active administrators
                  </span>
                </div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Pending Authors
                  </p>
                  <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                    {loading ? "..." : stats.pendingAuthors}
                  </h2>
                  <Link
                    to="/admin/authors"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2 inline-block"
                  >
                    View requests &rarr;
                  </Link>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* --- AUTHOR METRICS --- */}
        {isAuthor && (
          <>
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Articles
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                {loading ? "..." : stats.myTotalArticles}
              </h2>
              <span className="text-[11px] text-gray-400 mt-2 block">
                All time submissions
              </span>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Published
              </p>
              <h2 className="text-3xl font-extrabold text-emerald-600 mt-2">
                {loading ? "..." : stats.myPublishedArticles}
              </h2>
              <span className="text-[11px] text-emerald-600 font-medium mt-2 block">
                Live for readers
              </span>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pending Review
              </p>
              <h2 className="text-3xl font-extrabold text-amber-500 mt-2">
                {loading ? "..." : stats.myPendingArticles}
              </h2>
              <span className="text-[11px] text-amber-600 font-medium mt-2 block">
                In review queue
              </span>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Rejected
              </p>
              <h2 className="text-3xl font-extrabold text-rose-500 mt-2">
                {loading ? "..." : stats.myRejectedArticles}
              </h2>
              <span className="text-[11px] text-rose-600 font-medium mt-2 block">
                Needs revision
              </span>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ================= ROLE-SPECIFIC CONTENT LAYOUT ================= */}

      {/* 1. ADMIN & SUPER ADMIN VIEW */}
      {isAdminOrSuperAdmin && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Approved Roles Directory Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Approved Platform Staff
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified active members across authorized roles
                </p>
              </div>

              {/* Role Filter Chips */}
              <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                {[
                  "ALL",
                  ...(isSuperAdmin ? ["SUPER_ADMIN"] : []),
                  "ADMIN",
                  "AUTHOR",
                ].map((role) => {
                  const isActive = roleFilter === role;
                  return (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        isActive
                          ? "text-indigo-600"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeFilterBg"
                          className="absolute inset-0 bg-white rounded-lg shadow-xs"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                      <span className="relative z-10">
                        {role === "ALL" ? "All" : role.replace("_", " ")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Member</th>
                    <th className="pb-3 px-2">Role</th>
                    <th className="pb-3 px-2">Joined</th>
                    <th className="pb-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-400 text-xs">
                        Loading approved members...
                      </td>
                    </tr>
                  ) : filteredApprovedMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-gray-400 text-xs"
                      >
                        No approved users found for this filter.
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredApprovedMembers.map((member) => (
                        <motion.tr
                          key={member.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-gray-50/50 transition"
                        >
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                                {member.name ? member.name[0].toUpperCase() : "U"}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-xs">
                                  {member.name}
                                </p>
                                <p className="text-[11px] text-gray-400">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-2">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                                member.role === "SUPER_ADMIN"
                                  ? "bg-purple-50 text-purple-700 border-purple-100"
                                  : member.role === "ADMIN"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                  : "bg-blue-50 text-blue-700 border-blue-100"
                              }`}
                            >
                              {member.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-xs text-gray-500">
                            {member.joinedAt}
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {member.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Pending Previews Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Pending Authors Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">
                  Pending Author Applicants
                </h3>
                <Link
                  to={isSuperAdmin ? "/superadmin/authors" : "/admin/authors"}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>

              {recentPendingAuthors.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center border border-dashed border-gray-100 rounded-xl">
                  No pending author applications
                </p>
              ) : (
                <div className="space-y-3">
                  {recentPendingAuthors.map((author, index) => (
                    <motion.div
                      key={author.id || author._id || index}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {author.name || author.fullName}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {author.email}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                        Pending
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Articles Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">
                  Pending Article Review
                </h3>
                <Link
                  to={isSuperAdmin ? "/superadmin/articles" : "/admin/articles"}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>

              {recentPendingArticles.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center border border-dashed border-gray-100 rounded-xl">
                  No pending articles to review
                </p>
              ) : (
                <div className="space-y-3">
                  {recentPendingArticles.map((article, index) => (
                    <motion.div
                      key={article.id || article._id || article.slug || index}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {article.title}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-400">
                          By {article.authorName || article.author?.name || "Author"}
                        </span>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase">
                          {article.category || "General"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. AUTHOR ONLY VIEW */}
      {isAuthor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                My Recent Submissions
              </h2>
              <p className="text-xs text-gray-500">
                Track status of your drafted and submitted content
              </p>
            </div>
            <Link
              to="/authors/my-articles"
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              View All Articles &rarr;
            </Link>
          </div>

          {authorArticlesList.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
              <p className="text-xs text-gray-400">
                You haven't created any articles yet.
              </p>
              <Link
                to="/authors/create-article"
                className="mt-3 inline-block bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Create First Article
              </Link>
            </div>
          ) : (
            <motion.div
              variants={containerStagger}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-100"
            >
              {authorArticlesList.map((item, idx) => {
                const status = (item.status || "PENDING").toUpperCase();
                return (
                  <motion.div
                    key={item.id || item._id || item.slug || idx}
                    variants={fadeInUp}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Category: {item.category || "GENERAL"} &bull; Submitted:{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "Recent"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                        status === "APPROVED" || status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : status === "REJECTED"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {status === "APPROVED" ? "PUBLISHED" : status}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UnifiedDashboardPage;