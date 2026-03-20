import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  History,
} from "lucide-react";
import {
  pdfAPI,
  formatDate as formatHistoryDate,
} from "../../services/ChatService";

interface PDFUploadPageProps {
  onBack: () => void;
}

interface PDFFile {
  name: string;
  size: number;
  file: File;
  uploadedAt?: number;
}

const PDFUploadPage: React.FC<PDFUploadPageProps> = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recentPDFs, setRecentPDFs] = useState<PDFFile[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load recent PDFs from storage on mount
  React.useEffect(() => {
    chrome.storage.local.get(["recentPDFs"], (result) => {
      if (result.recentPDFs) {
        setRecentPDFs(result.recentPDFs);
      }
    });

    // Fetch chat history
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await pdfAPI.getUserChats();
        if (response.chats) {
          setHistory(response.chats);
        }
      } catch (error) {
        console.error("Failed to fetch PDF history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleFileSelect = (file: File) => {
    if (file.type === "application/pdf") {
      const pdfFile: PDFFile = {
        name: file.name,
        size: file.size,
        file: file,
      };
      setSelectedFile(pdfFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalyzePDF = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Save to recent PDFs
    const updatedPDF: PDFFile = {
      ...selectedFile,
      uploadedAt: Date.now(),
    };

    const updatedRecents = [updatedPDF, ...recentPDFs.slice(0, 4)];
    chrome.storage.local.set({ recentPDFs: updatedRecents });

    // Get current tab and send message to background
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.runtime.sendMessage({
          action: "uploadPDF",
          file: {
            name: selectedFile.name,
            size: selectedFile.size,
          },
        });
      }
    });

    setIsUploading(false);
    window.close();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="w-[400px] h-[600px] bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/NEWLOGO.png"
              alt="Adhyayan AI"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                PDF Upload & Analysis
              </h1>
              <p className="text-xs text-gray-500">Analyze documents with AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
            isDragging
              ? "border-purple-500 bg-purple-100"
              : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center text-center">
            <Upload
              className={`w-12 h-12 mb-3 ${isDragging ? "text-purple-600" : "text-gray-400"}`}
            />
            <p className="text-base font-semibold text-gray-800 mb-1">
              {isDragging ? "Drop PDF here" : "Click or drag PDF to upload"}
            </p>
            <p className="text-sm text-gray-500">PDF files only, max 10 MB</p>
          </div>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            </div>

            <button
              onClick={handleAnalyzePDF}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Analyze PDF
                </>
              )}
            </button>
          </div>
        )}

        {/* Recent PDFs */}
        {recentPDFs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Recent PDFs
            </h3>
            <div className="space-y-2">
              {recentPDFs.map((pdf, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedFile({
                      name: pdf.name,
                      size: pdf.size,
                      file: pdf.file,
                    })
                  }
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all text-left"
                >
                  <FileText className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {pdf.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(pdf.size)}</span>
                      {pdf.uploadedAt && (
                        <>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(pdf.uploadedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              PDF Chat History
            </h3>
          </div>
          {loadingHistory ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((chat, index) => (
                <div
                  key={index}
                  className="w-full flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <FileText className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {chat.title || chat.chat_id || "Untitled PDF"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatHistoryDate(chat.created_at || chat.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              No PDF chat history found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFUploadPage;
