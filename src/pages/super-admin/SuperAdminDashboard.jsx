import React, { useEffect, useState } from "react";
// import { superAdminApi } from "../../api/superAdminApi";
import { useAuth } from "../../context/AuthContext";

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();

  const [pendingAuthors, setPendingAuthors] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [pendingArticles, setPendingArticles] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const authors = await superAdminApi.getPendingAuthors();
      const admins = await superAdminApi.getPendingAdmins();
      const articles = await superAdminApi.getPendingArticles();

      setPendingAuthors(authors.data);
      setPendingAdmins(admins.data);
      setPendingArticles(articles.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveAuthor = async (id) => {
    await superAdminApi.approveAuthor(id);
    loadDashboard();
  };

  const rejectAuthor = async (id) => {
    await superAdminApi.rejectAuthor(id);
    loadDashboard();
  };

  const approveAdmin = async (id) => {
    await superAdminApi.approveAdmin(id);
    loadDashboard();
  };

  const rejectAdmin = async (id) => {
    await superAdminApi.rejectAdmin(id);
    loadDashboard();
  };

  const approveArticle = async (id) => {
    await superAdminApi.approveArticle(id);
    loadDashboard();
  };

  const rejectArticle = async (id) => {
    await superAdminApi.rejectArticle(id);
    loadDashboard();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Super Admin Dashboard
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
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Pending Authors</h3>
          <p className="text-4xl font-bold mt-2">
            {pendingAuthors.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Pending Admins</h3>
          <p className="text-4xl font-bold mt-2">
            {pendingAdmins.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Pending Articles</h3>
          <p className="text-4xl font-bold mt-2">
            {pendingArticles.length}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Pending Authors */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">
            Pending Authors
          </h2>

          {pendingAuthors.map((author) => (
            <div
              key={author.id}
              className="border rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold">{author.name}</h3>
              <p className="text-gray-500 text-sm">{author.email}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => approveAuthor(author.id)}
                  className="bg-green-500 text-white px-3 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectAuthor(author.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Admins */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">
            Pending Admins
          </h2>

          {pendingAdmins.map((admin) => (
            <div
              key={admin.id}
              className="border rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold">{admin.name}</h3>
              <p className="text-gray-500 text-sm">{admin.email}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => approveAdmin(admin.id)}
                  className="bg-green-500 text-white px-3 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectAdmin(admin.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Articles */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">
            Pending Articles
          </h2>

          {pendingArticles.map((article) => (
            <div
              key={article.id}
              className="border rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold text-lg">
                {article.title}
              </h3>

              <p className="text-sm text-gray-500">
                By {article.authorName}
              </p>

              <p className="text-gray-600 mt-2 line-clamp-3">
                {article.content}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => approveArticle(article.id)}
                  className="bg-green-500 text-white px-3 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectArticle(article.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;