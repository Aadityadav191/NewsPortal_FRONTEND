import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GetArticleBySlug } from "../../api/services/published.service";

const ArticleDetails = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await GetArticleBySlug(slug);
        setArticle(response.data.data || response.data);
      } catch (err) {
        console.log(err);
        console.log(err.response);
        console.log(err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading article...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">Article Not Found</h2>

        <Link
          to="/"
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        {/* Featured Image */}
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-[450px] object-cover"
        />

        <div className="p-8">
          {/* Category */}
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="mt-4 text-4xl font-bold text-slate-900 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500 border-b pb-6">
            <span>
              <strong>Author:</strong> {article.author?.name || article.author}
            </span>

            {article.approvedBy && (
              <span>
                <strong>Approved By:</strong>{" "}
                {article.approvedBy?.name || article.approvedBy}
              </span>
            )}

            <span>
              <strong>Published:</strong>{" "}
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Content */}

          <div className="mt-8 whitespace-pre-wrap text-slate-700 leading-8">
            {article.content}
          </div>
         

          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center px-5 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition"
            >
              ← Back to News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
