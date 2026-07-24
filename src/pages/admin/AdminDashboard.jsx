import React, { useEffect, useState } from "react";
// import { adminApi } from "../api/adminApi";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [pendingAuthors, setPendingAuthors] = useState([]);
  const [pendingArticles, setPendingArticles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authors = await adminApi.getPendingAuthors();
      const articles = await adminApi.getPendingArticles();

      setPendingAuthors(authors.data);
      setPendingArticles(articles.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveAuthor = async (id) => {
    await adminApi.approveAuthor(id);
    loadData();
  };

  const rejectAuthor = async (id) => {
    await adminApi.rejectAuthor(id);
    loadData();
  };

  const approveArticle = async (id) => {
    await adminApi.approveArticle(id);
    loadData();
  };

  const rejectArticle = async (id) => {
    await adminApi.rejectArticle(id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome, {user?.name}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Pending Authors</h3>
          <p className="text-4xl font-bold mt-2">
            {pendingAuthors.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Pending Articles</h3>
          <p className="text-4xl font-bold mt-2">
            {pendingArticles.length}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Pending Authors */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">
            Pending Author Requests
          </h2>

          {pendingAuthors.length === 0 ? (
            <p className="text-gray-500">
              No pending requests.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingAuthors.map((author) => (
                <div
                  key={author.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {author.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {author.email}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => approveAuthor(author.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectAuthor(author.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Articles */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">
            Pending Articles
          </h2>

          {pendingArticles.length === 0 ? (
            <p className="text-gray-500">
              No pending articles.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map((article) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-semibold text-lg">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2">
                    By {article.authorName}
                  </p>

                  <p className="text-gray-600 line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => approveArticle(article.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectArticle(article.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;