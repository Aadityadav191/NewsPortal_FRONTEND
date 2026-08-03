import api from "../axios";

//For All Login
export const loginApi = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// AUTHOR SIGNUP
export const authorSignup = (data) => {
  return api.post("/author/signup", data);
};

// ADMIN SIGNUP
export const adminSignup = (data) => {
  return api.post("/admin/signup", data);
};
