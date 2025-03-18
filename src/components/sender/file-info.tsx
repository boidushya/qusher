import React from "react";

interface FileInfoProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  totalChunks: number;
}

export const FileInfo: React.FC<FileInfoProps> = ({ fileName, fileSize, fileType, totalChunks }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = () => {
    if (fileType.includes("image")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (fileType.includes("video")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (fileType.includes("audio")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      );
    } else if (fileType.includes("pdf")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (fileType.includes("text") || fileType.includes("json") || fileType.includes("xml")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      );
    }
  };

  return (
    <div className="p-5 bg-zinc-800 rounded-lg border border-zinc-700">
      <h2 className="font-bold mb-4 text-zinc-100 text-lg flex items-center">
        <span className="text-blue-400 mr-2">{getFileIcon()}</span>
        File Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Name</span>
          <p className="text-zinc-100 font-medium truncate" title={fileName}>
            {fileName}
          </p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Size</span>
          <p className="text-zinc-100 font-medium">{formatFileSize(fileSize)}</p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Type</span>
          <p className="text-zinc-100">
            <code className="bg-zinc-700 px-2 py-1 rounded text-sm text-blue-300 font-mono">
              {fileType || "Unknown"}
            </code>
          </p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md flex items-center">
          <div>
            <span className="text-zinc-400 text-sm">Chunks</span>
            <p className="text-zinc-100 font-medium">{totalChunks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
