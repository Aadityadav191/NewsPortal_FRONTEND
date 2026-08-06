import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Eye,
  Clock,
  User,
  Calendar,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  getPendingArticles,
  approveArticle,
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

const ManageArticles = () => {
  const [pendingArticles, setPendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await getPendingArticles();
      setPendingArticles(res.data?.articles || res.data || []);
    } catch (err) {
      console.error("Failed to fetch pending articles:", err);
      toast.error("Failed to load pending articles.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (article, status) => {
    const slugOrId = article.slug || article.id || article._id;
    setProcessingId({ id: slugOrId, status });
    try {
      await approveArticle(slugOrId, { status });
      toast.success(
        `Article ${status === "APPROVED" ? "approved" : "rejected"} successfully!`
      );
      setPendingArticles((prev) =>
        prev.filter((a) => (a.slug || a.id || a._id) !== slugOrId)
      );
      if (
        selectedArticle &&
        (selectedArticle.slug || selectedArticle.id || selectedArticle._id) ===
          slugOrId
      ) {
        setSelectedArticle(null);
      }
    } catch (err) {
      console.error(`Failed to ${status} article:`, err);
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
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                <Clock className="w-3.5 h-3.5" /> Pending Articles
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Article Review Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and moderate member-submitted articles before publication.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl self-start sm:self-auto">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Pending
              </p>
              <p className="text-xl font-bold text-gray-900 leading-none mt-0.5">
                {loading ? "..." : pendingArticles.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      {loading ? (
        /* Skeleton Loading State */
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-6 bg-gray-100 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
              <div className="flex gap-3 pt-4">
                <div className="h-10 bg-gray-100 rounded-xl flex-1" />
                <div className="h-10 bg-gray-100 rounded-xl flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : pendingArticles.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-12"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            No Pending Articles
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            There are no pending articles awaiting approval right now. New
            submissions will appear here.
          </p>
          <button
            onClick={fetchArticles}
            className="px-5 py-2.5 bg-gray-900 text-white font-medium text-xs rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            Refresh
          </button>
        </motion.div>
      ) : (
        /* Articles Grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {pendingArticles.map((article) => {
              const articleKey = article.slug || article.id || article._id;
              const isApproving =
                processingId?.id === articleKey &&
                processingId?.status === "APPROVED";
              const isRejecting =
                processingId?.id === articleKey &&
                processingId?.status === "REJECTED";
              const isProcessingAny = processingId?.id === articleKey;

              const authorName =
                article.authorName || article.author?.name || "Anonymous Author";

              return (
                <motion.div
                  key={articleKey}
                  variants={cardVariants}
                  layout
                  exit="exit"
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Image Container */}
                    {article.featuredImage ? (
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {article.category && (
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-amber-800 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase shadow-sm border border-amber-200/50">
                            {article.category}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 pb-0">
                        {article.category && (
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase border border-amber-200/50">
                            {article.category}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content Info */}
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-xl leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-700 truncate max-w-37.5">
                            {authorName}
                          </span>
                        </div>
                        {article.createdAt && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(
                                article.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mt-3">
                        {article.content}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 pb-6 pt-2 space-y-3">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Article
                    </button>

                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                      <button
                        disabled={isProcessingAny}
                        onClick={() => handleAction(article, "APPROVED")}
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
                        onClick={() => handleAction(article, "REJECTED")}
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

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs"
            />

            {/* Modal Content Box */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 relative z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {selectedArticle.category || "Article Preview"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                {selectedArticle.featuredImage && (
                  <img
                    src={selectedArticle.featuredImage}
                    alt={selectedArticle.title}
                    className="w-full h-60 object-cover rounded-2xl mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Written by{" "}
                  <span className="text-gray-800 font-semibold">
                    {selectedArticle.authorName ||
                      selectedArticle.author?.name ||
                      "Author"}
                  </span>
                </p>
                <div className="pt-4 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap border-t border-gray-100">
                  {selectedArticle.content}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <button
                  onClick={() => handleAction(selectedArticle, "APPROVED")}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Approve Article
                </button>
                <button
                  onClick={() => handleAction(selectedArticle, "REJECTED")}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-2.5 rounded-xl text-xs transition-colors border border-rose-100 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Reject Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageArticles;