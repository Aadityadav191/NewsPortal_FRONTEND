import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Check,
  X,
  Mail,
  Calendar,
  Globe,
  Loader2,
  Eye,
  Sparkles,
  User,
} from "lucide-react";
import {
  getPendingAuthors,
  approveAuthor as approveAuthorApi,
} from "../../api/services/admin.service";

// Animation Variants
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

const ManageAuthor = () => {
  const [pendingAuthors, setPendingAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const res = await getPendingAuthors();
      setPendingAuthors(res.data?.authors || res.data || []);
    } catch (err) {
      console.error("Failed to fetch pending authors:", err);
      toast.error("Failed to load pending authors.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, status) => {
    setProcessingId({ id: userId, status });
    try {
      await approveAuthorApi(userId, { status });
      toast.success(
        `Author ${status === "APPROVED" ? "approved" : "rejected"} successfully!`,
      );
      setPendingAuthors((prev) =>
        prev.filter((author) => (author.id || author._id) !== userId),
      );
      if (
        selectedAuthor &&
        (selectedAuthor.id || selectedAuthor._id) === userId
      ) {
        setSelectedAuthor(null);
      }
    } catch (err) {
      console.error(`Failed to ${status} author:`, err);
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
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                <UserCheck className="w-3.5 h-3.5" /> Author Applications
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Author Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review writer applications and manage publishing permissions.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl self-start sm:self-auto">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Pending
              </p>
              <p className="text-xl font-bold text-gray-900 leading-none mt-0.5">
                {loading ? "..." : pendingAuthors.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      {loading ? (
        /* Skeleton Loading Grid */
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
      ) : pendingAuthors.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-12"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            All caught up!
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            There are currently no pending author applications requiring review.
          </p>
          <button
            onClick={fetchAuthors}
            className="px-5 py-2.5 bg-gray-900 text-white font-medium text-xs rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            Refresh List
          </button>
        </motion.div>
      ) : (
        /* Authors Grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {pendingAuthors.map((author) => {
              const authorId = author.id || author._id;
              const isApproving =
                processingId?.id === authorId &&
                processingId?.status === "APPROVED";
              const isRejecting =
                processingId?.id === authorId &&
                processingId?.status === "REJECTED";
              const isProcessingAny = processingId?.id === authorId;

              const initial = author.name ? author.name[0].toUpperCase() : "A";

              return (
                <motion.div
                  key={authorId}
                  variants={cardVariants}
                  layout
                  exit="exit"
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between p-6"
                >
                  <div>
                    {/* Author Profile Header */}
                    <div className="flex items-start gap-3 mb-4">
                      {author.avatar || author.profileImage ? (
                        <img
                          src={author.avatar || author.profileImage}
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                          {initial}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-blue-600 transition-colors">
                          {author.name || "Unnamed Applicant"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{author.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Optional Bio preview if present */}
                    {author.bio && (
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed bg-gray-50/80 p-3 rounded-xl border border-gray-100/80 mb-4">
                        "{author.bio}"
                      </p>
                    )}
                  </div>

                  {/* Card Action Controls */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => setSelectedAuthor(author)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Application Details
                    </button>

                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                      <button
                        disabled={isProcessingAny}
                        onClick={() => handleAction(authorId, "APPROVED")}
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
                        onClick={() => handleAction(authorId, "REJECTED")}
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

      {/* Author Application Detail Modal */}
      <AnimatePresence>
        {selectedAuthor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAuthor(null)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Content Box */}
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
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    Applicant Profile
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center gap-4">
                  {selectedAuthor.avatar || selectedAuthor.profileImage ? (
                    <img
                      src={selectedAuthor.avatar || selectedAuthor.profileImage}
                      alt={selectedAuthor.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                      {selectedAuthor.name
                        ? selectedAuthor.name[0].toUpperCase()
                        : "A"}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedAuthor.name || "Unnamed Applicant"}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" /> {selectedAuthor.email}
                    </p>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Biography & Statement
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-700 leading-relaxed">
                    {selectedAuthor.bio ||
                      selectedAuthor.about ||
                      "No biography provided by applicant."}
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedAuthor.website && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-gray-400 font-medium mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Portfolio / Website
                      </p>
                      <a
                        href={selectedAuthor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block font-medium"
                      >
                        {selectedAuthor.website}
                      </a>
                    </div>
                  )}
                  {selectedAuthor.createdAt && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-gray-400 font-medium mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Applied On
                      </p>
                      <p className="text-gray-800 font-medium">
                        {new Date(
                          selectedAuthor.createdAt
                        ).toLocaleDateString()}
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
                      selectedAuthor.id || selectedAuthor._id,
                      "APPROVED"
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Approve Applicant
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      selectedAuthor.id || selectedAuthor._id,
                      "REJECTED"
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-2.5 rounded-xl text-xs transition-colors border border-rose-100 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Reject Application
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageAuthor;