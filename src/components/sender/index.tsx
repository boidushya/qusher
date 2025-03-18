import React, { useState } from "react";
import { useInterval } from "../../hooks/useInterval";
import { calculateOptimalChunkSize, estimateQRCodeCount } from "../../utils/data-utils";
import { chunkData } from "../../utils/file-processor";
import { Collapse } from "../ui/collapse";
import { FileInfo } from "./file-info";
import { FileUpload } from "./file-upload";
import { PlaybackControls } from "./playback-control";
import { QRCodeDisplay } from "./qrcode-display";

const FileToQRCodeSequence: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileChunks, setFileChunks] = useState<string[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(200);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    processFile(file);
  };

  const processFile = (file: File) => {
    const chunkSize = calculateOptimalChunkSize(file.type || "application/octet-stream");

    const estimatedQRCodes = estimateQRCodeCount(file.size, chunkSize);

    if (estimatedQRCodes > 50) {
      alert(
        `Warning: This file will generate approximately ${estimatedQRCodes} QR codes. This may take a long time to transfer.`
      );
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const fileData = event.target?.result as ArrayBuffer;
      if (fileData) {
        const chunks = chunkData(fileData, chunkSize, {
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
        });
        setFileChunks(chunks);
        setCurrentChunkIndex(0);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const togglePlayback = (): void => {
    if (currentChunkIndex >= fileChunks.length - 1 && !isPlaying) {
      setCurrentChunkIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleLooping = (): void => {
    setIsLooping(!isLooping);
  };

  const resetToFirst = (): void => {
    setCurrentChunkIndex(0);
  };

  const goToNextChunk = (): void => {
    if (currentChunkIndex < fileChunks.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    } else if (isLooping) {
      setCurrentChunkIndex(0);
    }
  };

  const goToPrevChunk = (): void => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(currentChunkIndex - 1);
    }
  };

  useInterval(
    () => {
      if (isPlaying && fileChunks.length > 0) {
        setCurrentChunkIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= fileChunks.length) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return prevIndex;
            }
          }
          return nextIndex;
        });
      }
    },
    isPlaying ? playbackSpeed : null
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 rounded-xl shadow-lg border border-zinc-600/25">
      <FileUpload onFileSelect={handleFileSelect} />

      {fileChunks.length > 0 && (
        <div className="mb-6">
          <QRCodeDisplay
            data={fileChunks[currentChunkIndex]}
            currentIndex={currentChunkIndex}
            totalChunks={fileChunks.length}
            fileName={selectedFile?.name || "unknown"}
          />

          <PlaybackControls
            currentChunkIndex={currentChunkIndex}
            totalChunks={fileChunks.length}
            isPlaying={isPlaying}
            isLooping={isLooping}
            playbackSpeed={playbackSpeed}
            onPrevious={goToPrevChunk}
            onNext={goToNextChunk}
            onTogglePlay={togglePlayback}
            onToggleLoop={toggleLooping}
            onSpeedChange={setPlaybackSpeed}
            onReset={resetToFirst}
          />
        </div>
      )}

      {selectedFile && (
        <FileInfo
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          fileType={selectedFile.type || "Unknown"}
          totalChunks={fileChunks.length}
        />
      )}

      {!selectedFile && (
        <Collapse title="How to Send Files">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Select a file by clicking the upload area above</li>
            <li>Once uploaded, the file will be split into QR codes</li>
            <li>Use the playback controls to display QR codes sequentially</li>
            <li>The receiver should scan each QR code with their camera</li>
            <li>After all QR codes are scanned, the file can be reassembled</li>
          </ol>

          <div className="mt-4 p-3 bg-blue-900/30 rounded border border-blue-800/50 text-blue-200 text-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                For best results, use smaller files when possible (under 50Kb), adjust playback speed based on scanning
                conditions, ensure good lighting for easier scanning & keep QR codes clearly visible on screen
              </span>
            </div>
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default FileToQRCodeSequence;
