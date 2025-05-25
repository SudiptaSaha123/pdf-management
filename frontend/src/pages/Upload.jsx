import { useState } from "react";
import { uploadPDF } from "../api/api";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/layout/PageHeader";
import PDFUploader from "../components/pdf/PDFUploader";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file to upload");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await uploadPDF(formData, token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading PDF", error);
      setError("Failed to upload PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Upload PDF"
          description="Share your PDF documents securely with others"
        />

        <Card hasError={!!error}>
          {error && (
            <div className="border-b border-red-100 bg-red-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleUpload}>
            <PDFUploader
              onFileSelect={(file) => {
                setFile(file);
                setError("");
              }}
              onFileRemove={() => setFile(null)}
              selectedFile={file}
              error={error}
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload PDF"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
