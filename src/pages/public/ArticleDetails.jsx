import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { GetArticleBySlug } from "../../api/services/published.service";

// Motion Animation Profiles
const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const ArticleDetails = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  // Dynamic Scroll Reading Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await GetArticleBySlug(slug);
        setArticle(response.data?.data || response.data);
      } catch (err) {
        console.error("Fetch Article Error:", err);
        setError("Failed to fetch article details.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium animate-pulse">
          Loading editorial story...
        </p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md text-center space-y-4"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            Article Not Found
          </h2>
          <p className="text-sm text-slate-500">
            The story you are looking for might have been moved, removed, or is
            temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Headlines
          </Link>
        </motion.div>
      </div>
    );
  }

  // Calculate estimated reading time
  const wordCount = article.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Paragraph splitting for advertisement placement
  const contentParagraphs = article.content ? article.content.split("\n\n") : [];

  return (
    <>
      {/* Dynamic SEO Meta Management with Helmet */}
      <Helmet>
        <title>{`${article.title} | Global Newsroom`}</title>
        <meta
          name="description"
          content={
            article.content?.slice(0, 160) || "Read the latest update on this story."
          }
        />
        <meta property="og:title" content={article.title} />
        <meta
          property="og:description"
          content={article.content?.slice(0, 160)}
        />
        <meta property="og:image" content={article.featuredImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Top Sticky Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="bg-slate-50 min-h-screen py-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumb Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500"
          >
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <span>/</span>
            <span className="uppercase text-blue-600">{article.category}</span>
            <span>/</span>
            <span className="truncate max-w-xs text-slate-400">
              {article.title}
            </span>
          </motion.div>

          {/* Main 12-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 8-Column Content Column */}
            <motion.main
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-8 space-y-8"
            >
              <motion.article
                variants={fadeInUp}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-10 space-y-6"
              >
                {/* Category & Action Bar */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
                    {article.category || "General"}
                  </span>

                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => setBookmarked(!bookmarked)}
                      className={`p-2 rounded-full hover:bg-slate-100 transition cursor-pointer ${
                        bookmarked ? "text-blue-600" : ""
                      }`}
                      title="Save article"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                      className="p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
                      title="Share story link"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Article Headline */}
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight font-serif tracking-tight">
                  {article.title}
                </h1>

                {/* Author & Publication Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                      {(article.author?.name || article.author || "E")[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                        {article.author?.name || article.author || "Staff Writer"}
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span>Verified Journalist</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {readingTime} min read
                    </span>
                  </div>
                </div>

                {/* Hero Featured Image */}
                {article.featuredImage && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-inner"
                  >
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-[350px] sm:h-[480px] object-cover"
                    />
                    <div className="p-2 bg-slate-900/60 backdrop-blur-md absolute bottom-0 inset-x-0 text-[11px] text-slate-200 text-center">
                      Featured Coverage Image | Press Rights Reserved
                    </div>
                  </motion.div>
                )}

                {/* Editorial Executive Summary Takeaway Box */}
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <h4 className="font-extrabold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> Key Executive Takeaway
                  </h4>
                  <p className="text-sm text-blue-950 font-medium leading-relaxed italic">
                    {article.content?.slice(0, 180)}...
                  </p>
                </div>

                {/* Article Body Content with In-Article Advertisement Injection */}
                <div className="space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-serif">
                  {contentParagraphs.length > 0 ? (
                    contentParagraphs.map((para, idx) => (
                      <React.Fragment key={idx}>
                        <p className="whitespace-pre-wrap">{para}</p>

                        {/* Professional Modern Native Ad Unit after paragraph 2 */}
                        {idx === 1 && (
                          <motion.div
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 15 }}
                            viewport={{ once: true }}
                            className="my-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md relative overflow-hidden font-sans"
                          >
                            <span className="absolute top-2 right-3 text-[9px] uppercase font-bold text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                              Sponsored
                            </span>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-bold text-base text-white">
                                  Upgrade Your Tech Workflow
                                </h4>
                                <p className="text-xs text-slate-300">
                                  Try high-speed cloud instances optimized for developer applications.
                                </p>
                              </div>
                              <a
                                href="#ad-link"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shrink-0"
                              >
                                Learn More <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <p>{article.content}</p>
                  )}
                </div>

                {/* Editorial Approval Stamp */}
                {article.approvedBy && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between font-sans">
                    <span>
                      Fact checked & verified by editorial board.
                    </span>
                    <span className="font-bold text-slate-800">
                      Editor: {article.approvedBy?.name || article.approvedBy}
                    </span>
                  </div>
                )}

                {/* Social Interaction Bar */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between font-sans">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      liked
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{liked ? "Liked" : "Helpful Story"}</span>
                  </button>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Newsroom
                  </Link>
                </div>
              </motion.article>
            </motion.main>

            {/* Right 4-Column Sidebar Column */}
            <aside className="lg:col-span-4 space-y-8 font-sans">
              
              {/* Display Sidebar Banner Advertisement */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 text-center border border-slate-800 relative overflow-hidden"
              >
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Advertisement
                </span>
                <h3 className="text-xl font-black font-serif leading-snug">
                  Get Unlimited Premium Digital Access
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Subscribe today to get exclusive investigative reports, deep dives, and ad-free experience.
                </p>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
                  Subscribe For $1/Month
                </button>
              </motion.div>

              {/* Trending Stories Sidebar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                    Trending in News
                  </h3>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="group flex items-start gap-3 cursor-pointer"
                    >
                      <span className="text-2xl font-black text-slate-200 group-hover:text-blue-600 transition">
                        0{item}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          Politics & Policy
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                          Global leaders assemble for high-level summits on modern economic framework.
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription Card */}
              <div className="bg-blue-600 text-white rounded-3xl p-6 space-y-3">
                <MessageSquare className="w-6 h-6 text-blue-200" />
                <h3 className="text-lg font-bold font-serif">Daily Morning Briefing</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Get top verified news stories delivered straight to your inbox every morning.
                </p>
                <div className="space-y-2 pt-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-blue-700 placeholder-blue-300 text-xs text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition">
                    Join Free Briefing
                  </button>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetails;