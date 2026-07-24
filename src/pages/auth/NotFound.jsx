import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, } from "lucide-react"; // optional icons

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 7000);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-[#175dfb] px-6">
      <div className="text-center">
        {/* Animated 404 Header */}
        <p className="text-sm font-bold text-[#0e172b] uppercase tracking-widest">
          Lost in Space?
        </p>

        <p className="mt-6 text-xl leading-7 text-[#0e172b] max-w-lg mx-auto">
          Redirecting to Home Page in{" "}
          <span className="font-bold text-[#0e172b] text-3xl">{countdown}</span> seconds...
        </p>
        <h1 className="mt-4 text-6xl font-extrabold tracking-tight text-[#0e172b] sm:text-7xl">
          404 - Page Not Found
        </h1>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#0e172b] bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0e172b] rounded-lg shadow-lg hover:bg-green-700 hover:shadow-none transition-all"
          >
            <Home size={18} />
            Back to Homepage
          </Link>
        </div>

        {/* Helpful Links Section */}
        <div className="mt-16 border-t border-[#0e172b] pt-10">
          <p className="text-sm text-gray-500 font-medium mb-4">
            Try checking these out instead:
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link
              to="/auth/login"
              className="text-[#0e172b] hover:underline font-semibold"
            >
              Login
            </Link>
            <Link
              to="/contact"
              className="text-[#0e172b] hover:underline font-semibold"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="text-[#0e172b] hover:underline font-semibold"
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
