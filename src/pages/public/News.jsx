import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { PublishedArticles } from "../../api/services/published.service";
import { Newspaper, Loader2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "ALL"; // default to ALL

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await PublishedArticles();
        setArticles(response.data?.data || response.data || []);
      } catch (err) {
        console.error("Failed to load articles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const availableCategories = [
    "ALL",
    ...new Set(articles.map((a) => a.category).filter(Boolean)),
  ];

  const filteredArticles =
    currentCategory === "ALL"
      ? articles
      : articles.filter(
          (a) => a.category?.toLowerCase() === currentCategory.toLowerCase(),
        );

  const handleCategorySelect = (cat) => {
    if (cat === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat.toLowerCase() });
    }
  };

  // Formatting page title dynamically based on category
  const formattedCategory =
    currentCategory === "ALL"
      ? "All News"
      : currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
  const pageTitle = `${formattedCategory} | NewsPortal`;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading stories...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore the latest ${formattedCategory} stories and breaking news updates.`}
        />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={`Stay informed with our top ${formattedCategory} coverage.`}
        />
      </Helmet>

      <div className="bg-slate-50 min-h-screen py-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-900 capitalize font-serif">
                {currentCategory === "ALL"
                  ? "All News Stories"
                  : `${currentCategory} News`}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Showing {filteredArticles.length} stories
              </p>
            </div>

            {/* Filter Pills synced with URL */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {availableCategories.map((cat) => {
                const isActive =
                  currentCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {/* Animated background chip for active tab */}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-blue-600 rounded-full shadow-xs"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Article Cards Grid */}
          <AnimatePresence mode="wait">
            {filteredArticles.length > 0 ? (
              <motion.div
                key={currentCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article._id || article.id}
                    variants={cardVariants}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-48 bg-slate-100 relative overflow-hidden">
                        {article.featuredImage ? (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Newspaper className="w-8 h-8" />
                          </div>
                        )}
                        {article.category && (
                          <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                            {article.category}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 text-lg line-clamp-2 leading-snug">
                          <Link
                            to={`/article/${article.slug}`}
                            className="hover:text-blue-600 transition"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                          {article.content}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        to={`/article/${article.slug}`}
                        className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 group"
                      >
                        <span>Read Story</span>
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-12 text-center border border-slate-200"
              >
                <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                  No news articles found in "{currentCategory}".
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default News;