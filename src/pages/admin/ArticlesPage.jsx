// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   getPendingArticles,
//   approveArticle as approveArticleApi,
// } from "../../api/services/admin.service";

// const ArticlesPage = () => {
//   const [pendingArticles, setPendingArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoadingId, setActionLoadingId] = useState(null);

//   useEffect(() => {
//     fetchArticles();
//   }, []);

//   const fetchArticles = async () => {
//     setLoading(true);
//     try {
//       const res = await getPendingArticles();
//       setPendingArticles(res.data?.articles || res.data || []);
//     } catch (err) {
//       console.error("Error loading articles:", err);
//       toast.error("Failed to load article reviews.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleArticleAction = async (article, status) => {
//     const slugOrId = article.slug || article.id || article._id;
//     setActionLoadingId(slugOrId);

//     try {
//       await approveArticleApi(slugOrId, { status });
//       toast.success(
//         `Article ${status === "APPROVED" ? "approved" : "rejected"} successfully!`
//       );
//       setPendingArticles((prev) =>
//         prev.filter((a) => (a.slug || a.id || a._id) !== slugOrId)
//       );
//     } catch (err) {
//       console.error(`Failed to ${status} article:`, err);
//       toast.error(err?.response?.data?.message || "Action failed.");
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex justify-between items-center bg-green-900 p-6 rounded-2xl shadow-sm border border-gray-100">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Article Review Queue</h1>
//           <p className="text-gray-500 text-sm mt-1">Manage, approve, or reject draft articles submitted by authors.</p>
//         </div>
//         <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
//           {pendingArticles.length} Pending
//         </span>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-16">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
//         </div>
//       ) : pendingArticles.length === 0 ? (
//         <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-100">
//           <p className="text-gray-400 font-medium">No pending articles needing review.</p>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-6">
//           {pendingArticles.map((article) => {
//             const articleKey = article.slug || article.id || article._id;
//             const isProcessing = actionLoadingId === articleKey;

//             return (
//               <div key={articleKey} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
//                 <div>
//                   {article.featuredImage && (
//                     <img
//                       src={article.featuredImage}
//                       alt={article.title}
//                       className="w-full h-44 object-cover rounded-xl mb-4"
//                     />
//                   )}
//                   {article.category && (
//                     <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded uppercase">
//                       {article.category}
//                     </span>
//                   )}
//                   <h3 className="font-bold text-gray-900 text-lg mt-2">{article.title}</h3>
//                   <p className="text-xs text-gray-500 mb-3">
//                     By <span className="font-medium text-gray-700">{article.authorName || article.author?.name || "Unknown Author"}</span>
//                   </p>
//                   <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{article.content}</p>
//                 </div>

//                 <div className="flex gap-2 mt-6 pt-4 border-t border-gray-50">
//                   <button
//                     disabled={isProcessing}
//                     onClick={() => handleArticleAction(article, "APPROVED")}
//                     className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     disabled={isProcessing}
//                     onClick={() => handleArticleAction(article, "REJECTED")}
//                     className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium py-2 rounded-xl text-xs transition disabled:opacity-50 border border-rose-100 cursor-pointer"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArticlesPage;