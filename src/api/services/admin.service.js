import api from "../axios";

// Fetch Pending Authors
export const getPendingAuthors = () => {
  return api.get("/admin/pending-authors");
};

// Approve/Reject Author
export const approveAuthor = (userId, data) => {
  return api.patch(`/admin/approve-author/${userId}`, data);
};

// Fetch Pending Articles
export const getPendingArticles = () => {
  return api.get("/admin/pending-articles");
};

// Approve/Reject Article (Note: Expects articleSlug)
export const approveArticle = (articleSlug, data) => {
  return api.patch(`/admin/approve-articles/${articleSlug}`, data);
};