import React from 'react';
import { Link } from 'react-router-dom';

// 1. Mock Data structured exactly like a database model
const DUMMY_ARTICLES = [
  {
    id: '1',
    title: 'The Future of BALEN SHAH in Media Architecture: What Protest Happened',
    content: 'Artificial intelligence is rapidly changing how news platforms deploy context layouts, generate asset feeds, and manage content management systems on a global scale. Industry leaders weigh in on how next-gen systems streamline production lines while preserving absolute editorial integrity.',
    featuredImage: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202606/balen-shah-nepal-prime-minister-india-border-dispute-kathmandu-protests-congress-communbist-party-ge-020936769-16x9_0.jpg?VersionId=ai3libWX0InB9d54LfPHd6t2EZQUlZqQ',
    category: 'Politics',
    author: 'Aadit Yadav ',
    ApprovedBy: "Admin 1",
    createdAt: 'July 18, 2026'
  },
  {
    id: '2',
    title: 'Championship Season Wraps Up in Thrilling Double-Overtime Finish',
    content: 'Fans were left on the edge of their seats last night as the underdogs secured a historic victory in the final seconds of double-overtime. Relive the defining strategic plays, high-impact momentum shifts, and emotional post-game interviews.',
    featuredImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    author: 'Marcus Vance',
    ApprovedBy: "Admin 3",
    createdAt: 'July 17, 2026'
  },
  {
    id: '3',
    title: 'Indie Film Sweeps Global Festival Awards, Defying Box Office Expectations',
    content: 'A low-budget independent feature shot entirely on location over three weeks took home the top four cinematic accolades this weekend. Critics are calling it a structural masterpiece that challenges mainstream distribution models.',
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    category: 'Entertainment',
    author: 'Elena Rostova',
    ApprovedBy: "Admin 2",
    createdAt: 'July 16, 2026'
  },
  {
    id: '4',
    title: 'Market Trends Shift Dynamically Amid New Financial Policy Announcements',
    content: 'Global trading frameworks adjusted rapidly this morning following the surprise fiscal update from central banking authorities. Analysts predict long-term structural changes across venture portfolios and retail indicators alike.',
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    category: 'Finance',
    author: 'David Chen',
    createdAt: 'July 15, 2026'
  },
  {
    id: '5',
    title: 'Global Expedition Discovers Hidden Ecosystem in Remote Coastal Range',
    content: 'A joint scientific initiative has successfully mapped an isolated valley containing over forty previously undocumented biological species. The unique environmental variables offer unprecedented insight into regional evolution.',
    featuredImage: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
    category: 'Others',
    author: 'Dr. Alan Grant',
    createdAt: 'July 14, 2026'
  }
];

const Home = () => {
  // Extract the first article to highlight as the grand "Hero" banner
  const [heroArticle, ...remainingArticles] = DUMMY_ARTICLES;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Latest Headlines
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Stay informed with real-time editorial coverage across all divisions.
          </p>
        </div>

        {/* Featured Hero Article View */}
        {heroArticle && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12 hover:shadow-md transition duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 h-64 sm:h-96 lg:h-full min-h-75 relative">
                <img 
                  src={heroArticle.featuredImage} 
                  alt={heroArticle.title}
                  className="absolute inset-0 w-full h-full object-cover "
                />
              </div>
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wide">
                    {heroArticle.category}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 leading-tight hover:text-blue-600 transition">
                    <Link to={`/article/${heroArticle.id}`}>{heroArticle.title}</Link>
                  </h2>
                  <p className="mt-4 text-slate-600 line-clamp-4 leading-relaxed">
                    {heroArticle.content}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <span>By <strong className="text-slate-700">{heroArticle.author}</strong></span>
                  <span>Approved By : {heroArticle.ApprovedBy}</span>
                  <span>{heroArticle.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Section Dividers */}
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="bg-blue-600 w-2.5 h-5 rounded-sm mr-2.5 inline-block"></span>
          More Top Stories
        </h3>

        {/* Standard News Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {remainingArticles.map((article) => (
            <article 
              key={article.id} 
              className="bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between overflow-hidden hover:shadow-md transition duration-300"
            >
              <div>
                <div className="h-48 w-full relative bg-slate-100">
                  <img 
                    src={article.featuredImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-xs uppercase">
                    {article.category}
                  </span>
                </div>
                
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600 transition">
                    <Link to={`/article/${article.id}`}>{article.title}</Link>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {article.createdAt} • By {article.author}
                  </p>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link 
                  to={`/article/${article.id}`} 
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition group"
                >
                  Read Full Article
                  <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;