import NumberFlow from "@number-flow/react";
import React from "react";
import { FileMetadata } from "../../types";

interface MetadataDisplayProps {
  fileMetadata: FileMetadata;
  receivedChunks: Record<number, string>;
  lastScannedIndex: number;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ fileMetadata, receivedChunks, lastScannedIndex }) => {
  const progressPercentage = Math.round((Object.keys(receivedChunks).length / fileMetadata.totalChunks) * 100);
  const receivedCount = Object.keys(receivedChunks).length;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getProgressIcon = () => {
    if (progressPercentage < 33) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    } else if (progressPercentage < 66) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
  };

  const getFileIcon = () => {
    const fileType = fileMetadata.fileType;

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

  const estimateRemainingTime = () => {
    const chunksRemaining = fileMetadata.totalChunks - Object.keys(receivedChunks).length;
    const seconds = chunksRemaining * 1.5;

    if (seconds < 60) {
      return `${Math.ceil(seconds)} seconds`;
    } else {
      return `${Math.ceil(seconds / 60)} minutes`;
    }
  };

  const getProgressColorClass = () => {
    if (progressPercentage < 33) return "bg-yellow-600";
    if (progressPercentage < 66) return "bg-blue-600";
    return "bg-green-600";
  };

  return (
    <div className="my-6 p-5 bg-zinc-800 rounded-lg border border-zinc-700">
      <h2 className="font-bold mb-4 text-zinc-100 text-lg flex items-center">
        <span className="text-blue-400 mr-2">{getFileIcon()}</span>
        Receiving File
      </h2>

      {/* Progress section */}
      <div className="mb-4 bg-zinc-900/60 p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-blue-400 mr-2">{getProgressIcon()}</span>
            <span className="text-zinc-300">Progress</span>
          </div>
          <div className="text-zinc-300 font-medium whitespace-pre">
            <NumberFlow value={receivedCount} className="inline-block" /> of{" "}
            <NumberFlow value={fileMetadata.totalChunks} className="inline-block" /> chunks
          </div>
        </div>

        <div className="w-full bg-zinc-700 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-[width] ${getProgressColorClass()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">
            <NumberFlow value={progressPercentage} className="inline-block" />% complete
          </span>
          <span className="text-zinc-400">Est. remaining: {estimateRemainingTime()}</span>
        </div>
      </div>

      {/* File details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Filename</span>
          <p className="text-zinc-100 font-medium truncate" title={fileMetadata.fileName}>
            {fileMetadata.fileName}
          </p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Size</span>
          <p className="text-zinc-100 font-medium">{formatFileSize(fileMetadata.fileSize)}</p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Type</span>
          <p className="text-zinc-100">
            <code className="bg-zinc-700 px-2 py-1 rounded text-sm text-blue-300 font-mono">
              {fileMetadata.fileType || "Unknown"}
            </code>
          </p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Last Scanned</span>
          <p className="text-zinc-100 font-medium flex items-center">
            Chunk <NumberFlow value={lastScannedIndex + 1} className="mx-1" />
            <span className="ml-2 flex h-3 w-3">
              <span className="animate-ping absolute h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Extension</span>
          <p className="text-zinc-100">
            <code className="bg-zinc-700 px-2 py-1 rounded text-sm text-blue-300 font-mono">
              {fileMetadata.fileExtension ? `.${fileMetadata.fileExtension}` : "none"}
            </code>
          </p>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-md">
          <span className="text-zinc-400 text-sm">Total QR Codes</span>
          <p className="text-zinc-100 flex items-center justify-between">
            <span className="font-medium">
              <NumberFlow value={fileMetadata.totalChunks} />
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300">
              <NumberFlow value={progressPercentage} className="inline-block" />% scanned
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
