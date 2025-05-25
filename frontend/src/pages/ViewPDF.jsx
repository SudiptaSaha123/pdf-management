import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPDF, getComments, addComment } from "../api/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Import worker directly
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const BACKEND_URL = "http://localhost:3000";

const ViewPDF = () => {
  const { pdfId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [scale, setScale] = useState(1);
  const [fileName, setFileName] = useState("");

  const cleanPdfId = pdfId.split("-")[0];
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const res = await getSharedPDF(cleanPdfId);
        if (!res.data || !res.data.pdf) throw new Error("Invalid PDF data received");
        if (!res.data.pdf.fileUrl) throw new Error("PDF URL is missing");
        setPdfUrl(`${BACKEND_URL}${res.data.pdf.fileUrl}`);
        setFileName(res.data.pdf.fileName || "Document");
      } catch (error) {
        console.error("❌ Error fetching PDF:", error);
        setError(error.message || "Failed to load PDF.");
      }
    };

    const fetchComments = async () => {
      try {
        const res = await getComments(cleanPdfId);
        setComments(res.data.comments);
      } catch (error) {
        console.error("❌ Error fetching comments:", error);
      }
    };

    fetchPDF();
    fetchComments();
  }, [cleanPdfId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      const commentData = {
        pdfId: cleanPdfId,
        text: newComment,
        email: userEmail,
      };

      const res = await addComment(commentData);
      setComments((prevComments) => [res.data.comment, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setScale(1);

  const getDocumentIcon = (type = "default") => {
    switch (type) {
      case "toolbar":
        return (
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "error":
        return (
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "loading":
        return (
          <svg className="h-5 w-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
          {/* PDF Viewer Section */}
          <div className="lg:w-3/5">
            <div className="sticky top-20">
              {/* Container for both toolbar and PDF viewer */}
              <div className="w-full max-w-2xl mx-auto">
                {/* Toolbar */}
                <div className="mb-4 flex items-center justify-between gap-2 rounded-lg bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg bg-blue-50 p-2">
                      {getDocumentIcon("toolbar")}
                    </div>
                    <h2 className="truncate text-sm font-medium text-gray-900">
                      {fileName}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleZoomOut}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      title="Zoom Out"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      {Math.round(scale * 100)}%
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      title="Zoom In"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

        {/* PDF Viewer */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {error ? (
                    <div className="p-6">
                      <div className="rounded-lg bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            {getDocumentIcon("error")}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error Loading PDF</h3>
                            <p className="mt-2 text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
              </div>
                  ) : (
                    <div className="bg-gray-800 p-4">
                      <div className="max-h-[calc(100vh-180px)] overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
              <Document
                file={pdfUrl}
                          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                          onLoadError={(error) => setError(`Failed to load PDF: ${error.message}`)}
                loading={
                  <div className="flex h-64 items-center justify-center">
                              <div className="flex items-center gap-3">
                                {getDocumentIcon("loading")}
                                <span className="text-sm text-gray-400">Loading PDF...</span>
                              </div>
                  </div>
                }
              >
                {numPages &&
                  Array.from(new Array(numPages), (el, index) => (
                              <div key={`page_${index + 1}`} className="mb-4">
                    <Page
                      pageNumber={index + 1}
                                  scale={scale}
                                  className="mx-auto rounded-lg bg-white shadow-lg"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                              </div>
                  ))}
              </Document>
                      </div>
              </div>
            )}
                </div>
              </div>
          </div>
        </div>

          {/* Redesigned Comments Section */}
          <div className="lg:w-2/5">
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <span>Comments</span>
                    <span className="text-sm px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {comments.length}
                    </span>
            </h2>
                </div>

            {/* Comment Input */}
                <div className="p-6">
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="relative">
              <textarea
                placeholder="Write a comment..."
                        className="w-full resize-none rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                        rows="3"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isCommenting}
                        className="absolute bottom-3 right-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isCommenting ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <span>Post</span>
                        )}
              </button>
                    </div>
            </form>
                </div>

            {/* Comments List */}
                <div className="px-6 pb-6 space-y-6 max-h-[600px] overflow-y-auto">
              {comments.map((comment, index) => (
                    <div key={comment._id || index} className="group">
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                          {comment.user[0].toUpperCase()}
                        </div>
                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              comment.user === userEmail ? "text-blue-600" : "text-gray-900"
                            }`}>
                              {comment.user === userEmail ? "You" : comment.user.split('@')[0]}
                    </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                    </span>
                  </div>
                          <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap break-words">
                    {comment.text}
                  </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">No comments yet</p>
                      <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;
