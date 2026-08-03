import api from "../axios";


export const PublishedArticles = () => {
  return api.get("published/articles");
};

export const GetArticleBySlug = (slug) => {
  return api.get(`published/articles/${slug}`);
};


export const ApprovedAuthor=()=>{
  return api.get("published/authors");
};

export const ApprovedAdmin=()=>{
  return api.get("published/admins")
}