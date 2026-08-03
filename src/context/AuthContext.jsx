// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "../api/services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiresAt");
    setUser(null);
  };

  // Check auth on app startup
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const expiresAt = localStorage.getItem("expiresAt");

      if (storedUser && token && expiresAt) {
        if (Date.now() >= Number(expiresAt)) {
          logout();
        } else {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (err) {
      console.error("Failed to parse stored user, clearing auth state", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto logout after expiry while app is open
  useEffect(() => {
    if (!user) return;
    const expiresAt = localStorage.getItem("expiresAt");
    if (!expiresAt) return;
    const remainingTime = Number(expiresAt) - Date.now();
    if (remainingTime <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [user]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    const { user, token } = data;

    // Expire after 12 hours
    const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("expiresAt", expiresAt.toString());
    setUser(user);
    return user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
