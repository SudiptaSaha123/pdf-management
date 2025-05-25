import React, { useState } from 'react';
import Button from '../ui/Button';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const PDFUploader = ({ 
  onFileSelect, 
  onFileRemove, 
  selectedFile,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) return "Please select a PDF file";
    if (file.type !== "application/pdf") return "Only PDF files are allowed";
    if (file.size > MAX_FILE_SIZE) return "File size must be less than 10MB";
    onFileSelect(file);
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  return (
    <>
      <div
        className={`group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition duration-150 ease-in-out ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className={`rounded-full bg-gray-50 p-3 ${isDragging ? "bg-blue-100" : "group-hover:bg-gray-100"}`}>
            <svg
              className={`h-6 w-6 ${isDragging ? "text-blue-600" : "text-gray-600 group-hover:text-gray-700"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer font-medium text-blue-600 focus-within:outline-none hover:text-blue-500"
            >
              <span>Upload a PDF file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF up to 10MB</p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-900/5">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => onFileRemove()}
              className="rounded-full !p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFUploader; 