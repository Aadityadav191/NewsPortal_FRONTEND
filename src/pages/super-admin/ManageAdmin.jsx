import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Check,
  X,
  Mail,
  Calendar,
  Building,
  Loader2,
  Eye,
  Sparkles,
  Shield,
} from "lucide-react";
import {
  getPendingAdmins,
  approveAdmin as approveAdminApi,
} from "../../api/services/superadmin.service";

// Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.25 },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

const ManageAdmin = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getPendingAdmins();
      setPendingAdmins(res.data?.admins || res.data || []);
    } catch (err) {
      console.error("Failed to fetch pending admins:", err);
      toast.error("Failed to load pending admins.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, status) => {
    setProcessingId({ id: userId, status });
    try {
      await approveAdminApi(userId, { status });
      toast.success(
        `Admin request ${status === "APPROVED" ? "approved" : "rejected"} successfully!`
      );
      setPendingAdmins((prev) =>
        prev.filter((admin) => (admin.id || admin._id) !== userId)
      );
      if (selectedAdmin && (selectedAdmin.id || selectedAdmin._id) === userId) {
        setSelectedAdmin(null);
      }
    } catch (err) {
      console.error(`Failed to ${status} admin:`, err);
      toast.error(err?.response?.data?.message || "Action failed.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 p-2 sm:p-4"
    >
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm"
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                <ShieldCheck className="w-3.5 h-3.5" /> Superadmin Access Queue
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Admin Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and grant elevated administrative privileges to candidate
              accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl self-start sm:self-auto">
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Pending
              </p>
              <p className="text-xl font-bold text-gray-900 leading-none mt-0.5">
                {loading ? "..." : pendingAdmins.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      {loading ? (
        /* Skeleton Grid Loading State */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-gray-100 rounded-xl w-full" />
              <div className="flex gap-3 pt-2">
                <div className="h-10 bg-gray-100 rounded-xl flex-1" />
                <div className="h-10 bg-gray-100 rounded-xl flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : pendingAdmins.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-12"
        >
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Queue is empty!
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            There are no pending admin requests awaiting approval right now.
          </p>
          <button
            onClick={fetchAdmins}
            className="px-5 py-2.5 bg-gray-900 text-white font-medium text-xs rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            Refresh Requests
          </button>
        </motion.div>
      ) : (
        /* Admin Request Cards Grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {pendingAdmins.map((admin) => {
              const adminId = admin.id || admin._id;
              const isApproving =
                processingId?.id === adminId &&
                processingId?.status === "APPROVED";
              const isRejecting =
                processingId?.id === adminId &&
                processingId?.status === "REJECTED";
              const isProcessingAny = processingId?.id === adminId;

              const initial = admin.name ? admin.name[0].toUpperCase() : "A";

              return (
                <motion.div
                  key={adminId}
                  variants={cardVariants}
                  layout
                  exit="exit"
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between p-6"
                >
                  <div>
                    {/* Candidate Header */}
                    <div className="flex items-start gap-3 mb-4">
                      {admin.avatar || admin.profileImage ? (
                        <img
                          src={admin.avatar || admin.profileImage}
                          alt={admin.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                          {initial}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-purple-600 transition-colors">
                          {admin.name || "Unnamed Applicant"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{admin.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Optional Department/Role Note */}
                    {admin.department && (
                      <div className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50/80 p-2.5 rounded-xl border border-purple-100/80 mb-4 font-medium">
                        <Building className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span className="truncate">Dept: {admin.department}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Controls */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => setSelectedAdmin(admin)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Application
                    </button>

                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                      <button
                        disabled={isProcessingAny}
                        onClick={() => handleAction(adminId, "APPROVED")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {isApproving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" /> Approve
                          </>
                        )}
                      </button>

                      <button
                        disabled={isProcessingAny}
                        onClick={() => handleAction(adminId, "REJECTED")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 font-semibold py-2.5 rounded-xl text-xs transition-colors border border-rose-100 disabled:opacity-50 cursor-pointer"
                      >
                        {isRejecting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4" /> Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Candidate Details Inspection Modal */}
      <AnimatePresence>
        {selectedAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAdmin(null)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden flex flex-col shadow-2xl border border-gray-100 relative z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    Admin Candidate Verification
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center gap-4">
                  {selectedAdmin.avatar || selectedAdmin.profileImage ? (
                    <img
                      src={selectedAdmin.avatar || selectedAdmin.profileImage}
                      alt={selectedAdmin.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                      {selectedAdmin.name
                        ? selectedAdmin.name[0].toUpperCase()
                        : "A"}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedAdmin.name || "Unnamed Applicant"}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" /> {selectedAdmin.email}
                    </p>
                  </div>
                </div>

                {/* Justification / Note Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Access Statement / Note
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-700 leading-relaxed">
                    {selectedAdmin.reason ||
                      selectedAdmin.bio ||
                      "No message request provided."}
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedAdmin.department && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-gray-400 font-medium mb-1 flex items-center gap-1">
                        <Building className="w-3 h-3" /> Department
                      </p>
                      <p className="text-gray-800 font-medium">
                        {selectedAdmin.department}
                      </p>
                    </div>
                  )}
                  {selectedAdmin.createdAt && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-gray-400 font-medium mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Request Date
                      </p>
                      <p className="text-gray-800 font-medium">
                        {new Date(selectedAdmin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <button
                  onClick={() =>
                    handleAction(
                      selectedAdmin.id || selectedAdmin._id,
                      "APPROVED"
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Grant Access
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      selectedAdmin.id || selectedAdmin._id,
                      "REJECTED"
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-2.5 rounded-xl text-xs transition-colors border border-rose-100 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Reject Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageAdmin;