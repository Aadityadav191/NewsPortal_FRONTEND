import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyArticles } from "../../api/services/author.service";

const MyArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, APPROVED, PENDING, REJECTED

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await getMyArticles();
      setArticles(response.data?.articles || response.data || []);
    } catch (err) {
      console.error("Failed to fetch author articles:", err);
      // toast.error("Failed to load your articles.");
    } finally {
      setLoading(false);
    }
  };

  // Helper status filter check
  const filteredArticles = articles.filter((article) => {
    const status = (article.status || "PENDING").toUpperCase();
    if (activeTab === "ALL") return true;
    return status === activeTab;
  });

  const getStatusBadge = (status) => {
    const s = (status || "PENDING").toUpperCase();
    switch (s) {
      case "APPROVED":
      case "PUBLISHED":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Published</span>;
      case "REJECTED":
        return <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Rejected</span>;
      default:
        return <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Articles</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all your submitted articles.</p>
        </div>
        <Link
          to="/authors/create-article"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Write Article
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-t-2xl pt-2 gap-2 overflow-x-auto">
        {["ALL", "APPROVED", "PENDING", "REJECTED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 font-semibold text-xs tracking-wider border-b-2 transition uppercase ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "APPROVED" ? "Published" : tab} ({
              tab === "ALL"
                ? articles.length
                : articles.filter((a) => (a.status || "PENDING").toUpperCase() === tab).length
            })
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-b-2xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium">No articles found for this filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredArticles.map((article, idx) => {
            const articleKey = article.slug || article.id || article._id || idx;

            return (
              <div
                key={articleKey}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {article.featuredImage && (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                  )}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {article.category && (
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {article.category}
                      </span>
                    )}
                    {getStatusBadge(article.status)}
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mt-1">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mt-2">
                    {article.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                  <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "Recently created"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyArticlesPage;