// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   getPendingAuthors,
//   approveAuthor as approveAuthorApi,
// } from "../../api/services/admin.service";

// const AuthorPage = () => {
//   const [pendingAuthors, setPendingAuthors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoadingId, setActionLoadingId] = useState(null);

//   useEffect(() => {
//     fetchAuthors();
//   }, []);

//   const fetchAuthors = async () => {
//     setLoading(true);
//     try {
//       const res = await getPendingAuthors();
//       setPendingAuthors(res.data?.authors || res.data || []);
//     } catch (err) {
//       console.error("Error loading authors:", err);
//       toast.error("Failed to load author requests.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAuthorAction = async (userId, status) => {
//     setActionLoadingId(userId);
//     try {
//       await approveAuthorApi(userId, { status });
//       toast.success(
//         `Author request ${status === "APPROVED" ? "approved" : "rejected"} successfully!`
//       );
//       setPendingAuthors((prev) =>
//         prev.filter((author) => (author.id || author._id) !== userId)
//       );
//     } catch (err) {
//       console.error(`Failed to ${status} author:`, err);
//       toast.error(err?.response?.data?.message || "Action failed.");
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Author Applications</h1>
//           <p className="text-gray-500 text-sm mt-1">Review and approve incoming author requests.</p>
//         </div>
//         <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">
//           {pendingAuthors.length} Pending
//         </span>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-16">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//         </div>
//       ) : pendingAuthors.length === 0 ? (
//         <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-100">
//           <p className="text-gray-400 font-medium">No pending author applications found.</p>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {pendingAuthors.map((author) => {
//             const authorId = author.id || author._id;
//             const isProcessing = actionLoadingId === authorId;

//             return (
//               <div key={authorId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
//                 <div>
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg uppercase">
//                       {author.name ? author.name[0] : "A"}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="font-semibold text-gray-900 truncate">{author.name}</h3>
//                       <p className="text-xs text-gray-500 truncate">{author.email}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
//                   <button
//                     disabled={isProcessing}
//                     onClick={() => handleAuthorAction(authorId, "APPROVED")}
//                     className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     disabled={isProcessing}
//                     onClick={() => handleAuthorAction(authorId, "REJECTED")}
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

// export default AuthorPage;