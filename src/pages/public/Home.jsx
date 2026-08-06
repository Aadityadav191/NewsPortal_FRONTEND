import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Clock,
  User,
  ArrowRight,
  Newspaper,
  Layers,
  ChevronRight,
} from "lucide-react";
import { PublishedArticles } from "../../api/services/published.service";
import ServerOfflineState from "../../components/common/ServerOfflineState";

// Animation Variants
const fadeInHeader = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await PublishedArticles();
        setArticles(response.data.data || response.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-10 bg-slate-200 rounded w-1/3" />

          {/* Hero Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-96 bg-slate-200 rounded-3xl" />
            <div className="lg:col-span-4 space-y-4">
              <div className="h-28 bg-slate-200 rounded-2xl" />
              <div className="h-28 bg-slate-200 rounded-2xl" />
              <div className="h-28 bg-slate-200 rounded-2xl" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ServerOfflineState />;
  }

  // Categories Extraction
  const categories = [
    "ALL",
    ...new Set(articles.map((a) => a.category).filter(Boolean)),
  ];

  const filteredArticles =
    selectedCategory === "ALL"
      ? articles
      : articles.filter(
          (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const [heroArticle, ...remainingArticles] = filteredArticles;
  const secondaryHighlights = remainingArticles.slice(0, 3);
  const bottomGridArticles = remainingArticles.slice(3);

  return (
    <div className="bg-slate-50 min-h-screen font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Newsroom Title Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInHeader}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Nepal Newsroom
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-serif">
              Today's Breaking News
            </h1>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {/* Sliding active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryHomePill"
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

        {/* Lead Hero & Highlights Section */}
        <AnimatePresence mode="wait">
          {heroArticle ? (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Primary Main Headline (Hero 8 Cols) */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="lg:col-span-8 group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900">
                    {heroArticle.featuredImage ? (
                      <img
                        src={heroArticle.featuredImage}
                        alt={heroArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                        <Newspaper className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {heroArticle.category && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                        {heroArticle.category}
                      </span>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-3 text-xs text-slate-300 font-medium mb-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {heroArticle.author?.name ||
                            heroArticle.author ||
                            "Editorial"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(heroArticle.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug font-serif group-hover:text-blue-600 transition-colors">
                      <Link to={`/article/${heroArticle.slug}`}>
                        {heroArticle.title}
                      </Link>
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {heroArticle.content}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      {heroArticle.approvedBy && (
                        <span className="text-xs text-slate-400 font-medium">
                          Approved by:{" "}
                          <strong className="text-slate-600">
                            {heroArticle.approvedBy?.name ||
                              heroArticle.approvedBy}
                          </strong>
                        </span>
                      )}
                      <Link
                        to={`/article/${heroArticle.slug}`}
                        className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition group/link"
                      >
                        Read Lead Story{" "}
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Highlights Sidebar (4 Cols) */}
                <div className="lg:col-span-4 space-y-4 flex-col justify-between">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                      Top Highlights
                    </h3>
                  </div>

                  <motion.div
                    variants={containerStagger}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {secondaryHighlights.map((article) => (
                      <motion.div
                        key={article._id || article.id}
                        variants={cardItemVariant}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        className="group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition flex gap-4 items-center"
                      >
                        {article.featuredImage && (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                          />
                        )}
                        <div className="min-w-0 flex-1 space-y-1">
                          {article.category && (
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                              {article.category}
                            </span>
                          )}
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                            <Link to={`/article/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Bottom Grid for Trending News */}
              {bottomGridArticles.length > 0 && (
                <div className="space-y-6 pt-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
                      <Layers className="w-5 h-5 text-blue-600" />
                      Top Trending News
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Showing {bottomGridArticles.length} stories
                    </span>
                  </div>

                  {/* Bottom 4-Column Grid with Staggered Entrance */}
                  <motion.div
                    variants={containerStagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {bottomGridArticles.map((article) => (
                      <motion.article
                        key={article._id || article.id}
                        variants={cardItemVariant}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden"
                      >
                        <div>
                          <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                            {article.featuredImage ? (
                              <img
                                src={article.featuredImage}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                <Newspaper className="w-8 h-8" />
                              </div>
                            )}

                            {article.category && (
                              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900/80 backdrop-blur-xs text-white uppercase tracking-wider">
                                {article.category}
                              </span>
                            )}
                          </div>

                          <div className="p-5 space-y-2">
                            <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                              <Link to={`/article/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h4>

                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                              <span>
                                {article.author?.name ||
                                  article.author ||
                                  "Staff Writer"}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  article.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 pt-1">
                              {article.content}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-0">
                          <Link
                            to={`/article/${article.slug}`}
                            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition gap-1 group/btn"
                          >
                            Read Story
                            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl p-12 text-center border border-slate-200"
            >
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                No articles available in this category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;