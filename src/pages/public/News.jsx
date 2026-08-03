import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PublishedArticles } from "../../api/services/published.service";
import { Newspaper } from "lucide-react";

const News = () => {
  // 1. Read search params from the URL (e.g. ?category=politics)
  const [searchParams, setSearchParams] = useSearchParams(); //
  const currentCategory = searchParams.get("category") || "ALL"; // default to ALL

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles on mount
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

  // 2. Extract unique categories dynamically for filter buttons
  const availableCategories = [
    "ALL",
    ...new Set(articles.map((a) => a.category).filter(Boolean)),
  ];

  // 3. Filter articles based on URL category state
  const filteredArticles =
    currentCategory === "ALL"
      ? articles
      : articles.filter(
          (a) => a.category?.toLowerCase() === currentCategory.toLowerCase()
        );

  // Helper to change URL when category filter pill is clicked
  const handleCategorySelect = (cat) => {
    if (cat === "ALL") {
      setSearchParams({}); // removes ?category= parameter
    } else {
      setSearchParams({ category: cat.toLowerCase() }); // updates URL
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-slate-500">
        Loading articles...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 capitalize font-serif">
              {currentCategory === "ALL" ? "All News Stories" : `${currentCategory} News`}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredArticles.length} stories
            </p>
          </div>

          {/* Filter Pills synced with URL */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                  currentCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article._id || article.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-slate-100 relative">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
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
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Read Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              No news articles found in "{currentCategory}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;