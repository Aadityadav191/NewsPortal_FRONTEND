import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PublishedArticles } from "../../api/services/published.service";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch dynamic categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await PublishedArticles();
        const articles = response.data?.data || response.data || [];

        // Extract unique non-empty categories
        const extractedCategories = [
          ...new Set(articles.map((a) => a.category).filter(Boolean)),
        ];

        setCategories(extractedCategories);
      } catch (err) {
        console.error("Failed to load navbar categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    setIsOpen(false);
  };

  const handleDashboardNavigation = () => {
    switch (user?.role) {
      case "AUTHOR":
        navigate("/authors/dashboard");
        break;
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "SUPER_ADMIN":
        navigate("/superadmin/dashboard");
        break;
      default:
        break;
    }
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="shrink-0">
            <Link
              to="/"
              className="text-xl font-bold tracking-wider text-blue-400"
            >
              NEWS<span className="text-white">PORTAL</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-2 items-center">
            <Link
              to="/"
              className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Home
            </Link>

            {/* Category Dropdown Menu Divider */}
            <div className="h-4 w-px bg-slate-700 mx-2"></div>

            {/* Render Dynamic Categories on Desktop */}
            {categoriesLoading ? (
              <div className="flex items-center space-x-2 animate-pulse">
                <div className="h-6 w-16 bg-slate-800 rounded"></div>
                <div className="h-6 w-20 bg-slate-800 rounded"></div>
                <div className="h-6 w-16 bg-slate-800 rounded"></div>
              </div>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/news?category=${encodeURIComponent(cat.toLowerCase())}`}
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition capitalize"
                >
                  {cat}
                </Link>
              ))
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300 capitalize">
                  {user.role}
                </span>

                <span className="text-sm text-slate-300">
                  Hi, {user.name?.split(" ")[0]}
                </span>

                <button
                  onClick={handleDashboardNavigation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition cursor-pointer"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-md text-sm font-semibold transition shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Trigger Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slideout Menu Panel */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden bg-slate-850 border-t border-slate-800`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/news"
            onClick={() => setIsOpen(false)}
            className="block text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            All News
          </Link>

          <div className="border-t border-slate-800 my-2 pt-2">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Categories
            </p>
            {categoriesLoading ? (
              <div className="px-3 py-2 text-xs text-slate-500">Loading categories...</div>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/news?category=${encodeURIComponent(cat.toLowerCase())}`}
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-400 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-base font-medium capitalize"
                >
                  {cat}
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-slate-800 pt-4 pb-2 px-3">
            {user ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">
                    {user.name}
                  </span>
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded uppercase text-slate-300">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleDashboardNavigation}
                  className="w-full bg-blue-600 text-center text-white py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-center text-white py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;