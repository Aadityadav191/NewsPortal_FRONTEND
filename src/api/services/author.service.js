import api from "../axios";

// Create Article (Accepts FormData object)
export const createArticle = (formData) => {
  return api.post("/authors/create-article", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Fetch Author's Articles
export const getMyArticles = () => {
  return api.get("/authors/my-articles");
};