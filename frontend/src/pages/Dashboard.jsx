import { useEffect, useState } from "react";
import { getUserPDFs, sharePDF, deletePDF, renamePDF } from "../api/api";
import { useNavigate } from "react-router-dom";
import ShareModal from "../components/modals/ShareModal";
import DeleteModal from "../components/modals/DeleteModal";
import PDFCard from "../components/PDFCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleEmailInputKeyDown = (e) => {
    setEmailError("");
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addEmailToList();
    } else if (e.key === 'Backspace' && !emailInput && emailList.length > 0) {
      setEmailList(emailList.slice(0, -1));
    }
  };

  const addEmailToList = () => {
    const email = emailInput.trim();
    if (!email) return;
    
    if (isValidEmail(email)) {
      if (emailList.includes(email)) {
        setEmailError("This email has already been added");
      } else {
        setEmailList([...emailList, email]);
        setEmailInput("");
      }
    } else {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleEmailInputBlur = () => {
    return;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const removeEmail = (indexToRemove) => {
    setEmailList(emailList.filter((_, index) => index !== indexToRemove));
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setTimeout(() => {
      setSelectedPdf(null);
      setShareSuccess(false);
      setShareLink("");
      setEmailList([]);
      setEmailInput("");
    }, 300);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!emailList.length || !selectedPdf) return;

    setIsSharing(true);
    try {
      const res = await sharePDF({ pdfId: selectedPdf._id, emails: emailList }, token);
      setShareSuccess(true);
      setShareLink(res.data.link);
      setEmailList([]);
      setEmailInput("");
    } catch (error) {
      console.error("Error sharing PDF", error);
      setEmailError("Failed to share PDF. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const fetchPDFs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getUserPDFs(token);
      setPdfs(res.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      setError("Failed to load PDFs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/");
    fetchPDFs();
  }, [navigate, token]);

  const handleShareClick = (pdf) => {
    setSelectedPdf(pdf);
    setIsShareModalOpen(true);
  };

  const handleDeleteClick = (pdf) => {
    setPdfToDelete(pdf);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!pdfToDelete) return;

    setIsDeleting(true);
    try {
      await deletePDF(pdfToDelete._id);
      fetchPDFs();
      setIsDeleteModalOpen(false);
      setPdfToDelete(null);
    } catch (error) {
      console.error("Error deleting PDF:", error);
      alert("Failed to delete PDF. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = (pdf) => {
    setEditingId(pdf._id);
    setNewFileName(pdf.fileName);
  };

  const handleRename = async (pdfId) => {
    if (!newFileName.trim()) return;
    
    try {
      await renamePDF(pdfId, newFileName);
      setEditingId(null);
      fetchPDFs();
    } catch (error) {
      console.error("Error renaming PDF:", error);
      alert("Failed to rename PDF. Please try again.");
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewFileName("");
  };

  // Filter PDFs based on search query
  const filteredPdfs = pdfs.filter(pdf => 
    pdf.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Your PDFs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and collaborate on your PDF documents
            </p>
          </div>
          {pdfs.length > 0 && (
            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload PDF
            </button>
          )}
        </div>

        {pdfs.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search PDFs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white pl-10 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        ) : pdfs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPdfs.map((pdf) => (
              <PDFCard
                key={pdf._id}
                pdf={pdf}
                editingId={editingId}
                newFileName={newFileName}
                setNewFileName={setNewFileName}
                handleRename={handleRename}
                cancelEditing={cancelEditing}
                startEditing={startEditing}
                onShare={handleShareClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        selectedPdf={selectedPdf}
        shareSuccess={shareSuccess}
        shareLink={shareLink}
        copySuccess={copySuccess}
        setCopySuccess={setCopySuccess}
        emailList={emailList}
        emailInput={emailInput}
        emailError={emailError}
        isSharing={isSharing}
        handleShare={handleShare}
        setEmailInput={setEmailInput}
        setEmailError={setEmailError}
        handleEmailInputKeyDown={handleEmailInputKeyDown}
        handleEmailInputBlur={handleEmailInputBlur}
        removeEmail={removeEmail}
        setEmailList={setEmailList}
        setIsShareModalOpen={setIsShareModalOpen}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        pdfToDelete={pdfToDelete}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
