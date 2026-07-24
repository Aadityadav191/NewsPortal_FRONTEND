import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // Form input & UI states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      toast.success("Login successful!");

      // Navigate based on user role
      switch (user?.role) {
        case "SUPER_ADMIN":
          navigate("/superadmin/dashboard", { replace: true });
          break;

        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;

        case "AUTHOR":
          navigate("/authors/dashboard", { replace: true });
          break;

        default:
          toast.error("User role is unassigned or invalid.");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        "Invalid email or password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#091226] flex items-center justify-center p-6 selection:bg-[#de8f32] selection:text-[#031c36]">
        {/* Background Decorative Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#015aae] blur-[120px] opacity-20"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#de8f32] blur-[120px] opacity-10"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-3xl grid lg:grid-cols-2 bg-[#042545]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-[#015aae] to-[#031c36] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            ></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative z-10"
            >
              <div className="text-2xl font-black italic tracking-tighter text-white mb-4">
                {"<"} ONLINE{" "}
                <span className="text-[#de8f32]">KHABER {"/>"}</span>
              </div>

              <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                Access the <span className="text-[#de8f32]">Articles</span> of
                yours
              </h2>

              <p className="text-blue-100/60 leading-relaxed text-xs">
                Log in to manage your infrastructure, view project milestones,
                and collaborate with your dedicated engineering team.
              </p>
            </motion.div>

            <div className="absolute -bottom-20 -right-20 w-80 h-80 border-t border-l border-white/10 rounded-full animate-spin-slow"></div>
          </div>

          {/* Login Form */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome Back
              </h1>

              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <NavLink
                  to="/auth/signup"
                  className="text-[#de8f32] hover:underline font-semibold"
                >
                  Join the team
                </NavLink>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="group space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                  Work Email
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#de8f32] transition-colors">
                    <Mail size={18} />
                  </div>

                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#de8f32]/50 focus:bg-white/8 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Security Key
                  </label>

                  <button
                    type="button"
                    className="text-[10px] text-[#015aae] hover:text-[#de8f32] transition-colors font-bold uppercase tracking-widest"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#de8f32] transition-colors">
                    <Lock size={18} />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-11 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#de8f32]/50 focus:bg-white/8 transition-all disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group w-full bg-[#de8f32] text-[#031c36] font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#c97d28] transition-all transform active:scale-95 shadow-xl shadow-[#de8f32]/10 mt-2 disabled:opacity-60 ${
                  isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isSubmitting ? "LOGGING IN..." : "LOGIN"}

                {!isSubmitting && (
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-8">
                <div className="h-px bg-white/5 flex-1"></div>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Digital ID
                </span>
                <div className="h-px bg-white/5 flex-1"></div>
              </div>

              {/* Return Home */}
              <section className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/5 hover:border-white/10 group">
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
              </section>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}