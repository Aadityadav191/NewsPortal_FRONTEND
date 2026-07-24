import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { createArticle, getMyArticles } from "../../api/services/author.service";

const AuthorDashboard = () => {
  const { user, logout } = useAuth();

  const [articles, setArticles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    featuredImage: null,
  });

  // Fetch author articles on page load
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await getMyArticles();
      setArticles(response.data?.articles || response.data || []);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "featuredImage") {
      setFormData((prev) => ({
        ...prev,
        featuredImage: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.content) {
      toast.error("Please fill in all required fields (title, category, content).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("content", formData.content);
      if (formData.featuredImage) {
        payload.append("featuredImage", formData.featuredImage);
      }

      const response = await createArticle(payload);
      toast.success("Article created successfully ! Wait for approval");

      // Clear input fields after success
      setFormData({
        title: "",
        category: "",
        content: "",
        featuredImage: null,
      });

      // Clear the file input visually
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      // Refresh articles list dynamically or append new article to state
      if (response.data?.article) {
        setArticles((prev) => [response.data.article, ...prev]);
      } else {
        fetchArticles();
      }
    } catch (err) {
      console.error("Article creation failed:", err);
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to create article. Please check your inputs and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name || "Author"}
          </h1>
          <p className="text-gray-500">Author Dashboard</p>
        </div>

        <div className="flex justify-between gap-5 items-center">
          <div className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg">
            <NavLink
              to="/"
              className="flex items-center gap-1 text-white hover:text-[#de8f32] text-sm font-bold tracking-tight transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Return to Home
            </NavLink>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create Article */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-5">Create New Article</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article title"
                disabled={isSubmitting}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Featured Image</label>

              <input
                type="file"
                name="featuredImage"
                accept="image/*"
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border rounded-lg p-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
              >
                <option value="">Select a category</option>
                <option value="FINANCE">FINANCE</option>
                <option value="POLITICS">POLITICS</option>
                <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                <option value="SPORTS">SPORTS</option>
                <option value="TECHNOLOGY">TECHNOLOGY</option>
                <option value="BUSINESS">BUSINESS</option>
                <option value="HEALTH">HEALTH</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="LIFESTYLE">LIFESTYLE</option>
                <option value="TRAVEL">TRAVEL</option>
                <option value="WORLD">WORLD</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Content</label>

              <textarea
                rows={8}
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article..."
                disabled={isSubmitting}
                required
                className="w-full border rounded-lg px-4 py-2 resize-none focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Publishing..." : "Publish Article"}
            </button>
          </form>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-5">Your Articles</h2>

          {articles.length === 0 ? (
            <p className="text-gray-500">No articles found.</p>
          ) : (
            <div className="space-y-4">
              {articles.map((article, index) => (
                <div
                  key={article.id || article._id || index}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-bold">{article.title}</h3>

                  <p className="text-sm text-blue-600 mt-1">
                    {article.category}
                  </p>

                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {article.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;