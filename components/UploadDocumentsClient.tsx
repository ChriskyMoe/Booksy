"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Receipt,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UploadDocumentsClientProps {
  userId: string;
}

interface UploadResult {
  id: string;
  fileName: string;
  status: "uploading" | "processing" | "success" | "error";
  type: "receipt" | "invoice";
  data?: any;
  file?: {
    name: string;
    url: string | null;
    path: string;
  };
  error?: string;
}

export default function UploadDocumentsClient({
  userId,
}: UploadDocumentsClientProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"receipt" | "invoice">(
    "receipt"
  );
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [viewingData, setViewingData] = useState<UploadResult | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        alert(`${file.name} is not a valid image or PDF file`);
        continue;
      }

      // Create upload record
      const uploadId = Math.random().toString(36).substring(7);
      const newUpload: UploadResult = {
        id: uploadId,
        fileName: file.name,
        status: "uploading",
        type: selectedType,
      };

      setUploads((prev) => [newUpload, ...prev]);

      try {
        // Create form data
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", selectedType);
        formData.append("userId", userId);

        // Update status to processing
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, status: "processing" } : u
          )
        );

        // Upload and process with OCR
        const response = await fetch("/api/ocr-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Failed to process document");
        }

        const result = await response.json();

        // Update status to success
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: "success",
                  data: result.data,
                  file: result.file,
                }
              : u
          )
        );
      } catch (error) {
        console.error("Upload error:", error);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : u
          )
        );
      }
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
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSaveData = (upload: UploadResult) => {
    if (upload.type === "receipt") {
      // Redirect to transactions page with pre-filled data
      const queryParams = new URLSearchParams({
        prefill: JSON.stringify({
          description: upload.data?.merchant_name || "",
          amount: upload.data?.total_amount || "",
          category: upload.data?.category || "",
          date: upload.data?.date || "",
          receipt_url: upload.file?.url || "",
        }),
      });
      router.push(`/transactions?${queryParams.toString()}`);
    } else {
      // Redirect to invoices page
      router.push("/invoices");
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Type Selection */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedType("receipt")}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            selectedType === "receipt"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <Receipt className="h-8 w-8 mx-auto mb-2" />
          <div className="font-semibold">Receipt</div>
          <div className="text-sm text-muted-foreground">
            Expense receipts and bills
          </div>
        </button>
        <button
          onClick={() => setSelectedType("invoice")}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            selectedType === "invoice"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <FileText className="h-8 w-8 mx-auto mb-2" />
          <div className="font-semibold">Invoice</div>
          <div className="text-sm text-muted-foreground">Customer invoices</div>
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">
          Drop your {selectedType}s here
        </h3>
        <p className="text-muted-foreground mb-4">or click to browse files</p>
        <label className="inline-flex cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Select Files
          </span>
        </label>
        <p className="text-sm text-muted-foreground mt-4">
          Supports: JPG, PNG, PDF (Max 10MB per file)
        </p>
      </div>

      {/* Upload Results */}
      {uploads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upload History</h3>
          <div className="space-y-2">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
              >
                {upload.type === "receipt" ? (
                  <Receipt className="h-8 w-8 text-blue-500 flex-shrink-0" />
                ) : (
                  <FileText className="h-8 w-8 text-green-500 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{upload.fileName}</div>
                  <div className="text-sm text-muted-foreground">
                    {upload.type.charAt(0).toUpperCase() + upload.type.slice(1)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {upload.status === "uploading" && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                  {upload.status === "processing" && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">Processing OCR...</span>
                    </div>
                  )}
                  {upload.status === "success" && (
                    <>
                      <button
                        onClick={() => setViewingData(upload)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Data
                      </button>
                      <button
                        onClick={() => handleSaveData(upload)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                    </>
                  )}
                  {upload.status === "error" && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm">
                        {upload.error || "Failed"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Viewer Modal */}
      {viewingData && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingData(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Extracted Data</h3>
              <button
                onClick={() => setViewingData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-2">
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(viewingData.data, null, 2)}
              </pre>
            </div>

            {viewingData.file?.url && (
              <div className="mt-4">
                <a
                  href={viewingData.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View uploaded file →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="rounded-lg border p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">How it works</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Select document type (Receipt or Invoice)</li>
          <li>2. Upload one or multiple files</li>
          <li>3. OCR automatically extracts data from your documents</li>
          <li>4. Review and edit extracted information</li>
          <li>5. Save to your transactions or invoices</li>
        </ol>
      </div>
    </div>
  );
}
