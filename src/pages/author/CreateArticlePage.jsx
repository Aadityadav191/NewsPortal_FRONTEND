import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UploadCloud,
  X,
  FileText,
  Tag,
  Image as ImageIcon,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import { createArticle } from "../../api/services/author.service";

const CATEGORIES = [
  "FINANCE",
  "POLITICS",
  "ENTERTAINMENT",
  "SPORTS",
  "TECHNOLOGY",
  "BUSINESS",
  "HEALTH",
  "SCIENCE",
  "EDUCATION",
  "LIFESTYLE",
  "TRAVEL",
  "WORLD",
];

const CreateArticlePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    featuredImage: null,
  });

  // Calculate live stats for the editor
  const wordCount = formData.content.trim()
    ? formData.content.trim().split(/\s+/).length
    : 0;
  const charCount = formData.content.length;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "featuredImage") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, featuredImage: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.content) {
      toast.error("Please fill in all required fields (title, category, content).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("content", formData.content);
      if (formData.featuredImage) {
        payload.append("featuredImage", formData.featuredImage);
      }

      await createArticle(payload);
      toast.success("Article created successfully! Awaiting review.");

      // Navigate to articles list after successful submission
      navigate("/authors/my-articles");
    } catch (err) {
      console.error("Article creation failed:", err);
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to create article. Please check your inputs and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6 font-sans">
      {/* Navigation Topbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/authors/my-articles")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" /> Newsroom Composer
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Write New News Articles
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Write and submit a news story for peer editorial review & approval.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              Article Headline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Global Tech Summit Unveils Next-Gen AI Standards..."
              disabled={isSubmitting}
              required
              className="w-full text-lg font-semibold border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50 transition"
            />
          </div>

          {/* Category & Image Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-600" />
                Category / Bureau <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 font-medium bg-white disabled:opacity-50 transition"
              >
                <option value="" disabled>
                  Select category desk...
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Image Uploader */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                Featured Cover Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                name="featuredImage"
                accept="image/*"
                onChange={handleChange}
                disabled={isSubmitting}
                className="hidden"
                id="featured-image-upload"
              />

              {!imagePreview ? (
                <label
                  htmlFor="featured-image-upload"
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-3 flex items-center justify-center gap-3 cursor-pointer transition text-slate-600 group"
                >
                  <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition" />
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition">
                    Upload image (PNG, JPG, WebP)
                  </span>
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-16 bg-slate-900 flex items-center justify-between px-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={imagePreview}
                      alt="Featured Preview"
                      className="w-12 h-12 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {formData.featuredImage?.name || "Image Attached"}
                      </p>
                      <p className="text-[10px] text-slate-400">Ready for publish</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Article Body Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Article Content <span className="text-red-500">*</span>
              </label>
              {/* Word & Character Counter */}
              <div className="text-[11px] font-medium text-slate-400 gap-3 flex">
                <span>{wordCount} Words</span>
                <span>•</span>
                <span>{charCount} Characters</span>
              </div>
            </div>

            <textarea
              rows={14}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write or paste your news story content here..."
              disabled={isSubmitting}
              required
              className="w-full border border-slate-200 rounded-2xl p-4 leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 placeholder:text-slate-400 disabled:opacity-50 transition"
            />
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/authors/my-articles")}
            className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs transition"
          >
            Cancel Draft
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-2xl font-bold text-xs shadow-sm hover:shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit for Approval
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;