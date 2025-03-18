import QrScanner from "qr-scanner";
import React, { useState, useEffect, useRef } from "react";
import { FileChunk, FileMetadata, ProgressState } from "../../types";
import { assembleFileFromChunks } from "../../utils/file-processor";
import { Collapse } from "../ui/collapse";
import { ChunkDisplay } from "./chunk-display";
import { MetadataDisplay } from "./metadata-display";
import { QRScanner } from "./qr-scanner";

const QRCodeReceiver: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [receivedChunks, setReceivedChunks] = useState<Record<number, string>>({});
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [progress, setProgress] = useState<ProgressState>({ received: 0, total: 0 });
  const [lastScannedIndex, setLastScannedIndex] = useState<number>(-1);
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const lastProcessedData = useRef("");
  const feedbackTimeoutRef = useRef<number | null>(null);
  const progressSectionRef = useRef<HTMLDivElement>(null); // Reference to the progress section

  // Check if all chunks are received
  useEffect(() => {
    if (fileMetadata && progress.total > 0) {
      const allChunksReceived = Object.keys(receivedChunks).length >= progress.total;

      if (allChunksReceived) {
        // Verify no chunks are missing
        const chunksArray = Array(progress.total)
          .fill(null)
          .map((_, index) => receivedChunks[index]);

        const allChunksPresent = !chunksArray.some(chunk => !chunk);

        if (allChunksPresent && !downloadReady) {
          // Play a sound or provide feedback when all chunks are received
          try {
            const audio = new Audio(
              "data:audio/mp3;base64,SUQzAwAAAAABOlRTU0UAAAAwAAAATEFNRSA2NGJpdHMgdmVyc2lvbiAzLjEwMABURU5DAAAABQAAAFVuaWNvZGUAVFlFUgAAAAUAAABMQU1FAP/7kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            );
            audio.volume = 0.5;
            audio.play().catch(() => console.log("Audio play prevented by browser policy"));
          } catch (e) {
            console.log("Audio playback error:", e);
          }

          // Show completion feedback
          showFeedback("All chunks received!", "success");
        }

        setDownloadReady(allChunksPresent);

        console.log("Download ready:", allChunksPresent);
        console.log("Total chunks received:", Object.keys(receivedChunks).length);
        console.log("Expected chunks:", progress.total);
      }
    }
  }, [receivedChunks, fileMetadata, progress.total, downloadReady]);

  // New effect to handle scrolling to progress section when scanning starts or a new chunk is received
  useEffect(() => {
    if (scanning && fileMetadata && progressSectionRef.current) {
      // Scroll to progress section with smooth animation
      progressSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [scanning, fileMetadata, lastScannedIndex]); // Re-run when scanning starts or a new chunk is scanned

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  // Toggle scanning
  const toggleScanning = (): void => {
    setScanning(!scanning);

    // If starting scanning and metadata exists, scroll to progress section
    if (!scanning && fileMetadata && progressSectionRef.current) {
      setTimeout(() => {
        progressSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300); // Short delay to allow the UI to update
    }
  };

  // Show feedback message with type
  const showFeedback = (message: string, type: "success" | "warning" | "info" = "info") => {
    // First, remove any existing feedback element
    const existingFeedback = document.getElementById("scan-feedback");
    if (existingFeedback) {
      document.body.removeChild(existingFeedback);
    }

    // Clear any pending timeout
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    // Create new feedback element
    const scanFeedback = document.createElement("div");
    scanFeedback.id = "scan-feedback";

    // Apply styles based on type
    let bgColor = "bg-blue-500";
    let icon = `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`;

    if (type === "success") {
      bgColor = "bg-green-500";
      icon = `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`;
    } else if (type === "warning") {
      bgColor = "bg-yellow-500";
      icon = `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>`;
    }

    scanFeedback.className = `fixed bottom-5 right-5 ${bgColor} bg-opacity-90 z-50 shadow-lg rounded-lg text-white p-4 transform transition-transform duration-300 flex items-center`;
    scanFeedback.innerHTML = `
      <div class="flex items-center">
        ${icon}
        <p class="font-medium">${message}</p>
      </div>
    `;

    document.body.appendChild(scanFeedback);

    // Animate in
    setTimeout(() => {
      scanFeedback.style.transform = "translateY(0)";
    }, 10);

    // Remove after delay
    feedbackTimeoutRef.current = setTimeout(() => {
      if (scanFeedback.parentNode) {
        scanFeedback.style.transform = "translateY(10px)";
        scanFeedback.style.opacity = "0";
        setTimeout(() => {
          if (scanFeedback.parentNode) {
            document.body.removeChild(scanFeedback);
          }
        }, 300);
      }
    }, 2000);
  };

  // Handle successful QR code scan
  const handleScan = (result: QrScanner.ScanResult): void => {
    try {
      // Avoid processing the same QR code multiple times in quick succession
      // by comparing with the last processed data
      if (lastProcessedData.current === result.data) {
        return;
      }

      // Store this data to prevent duplicate processing
      lastProcessedData.current = result.data;
      setTimeout(() => {
        if (lastProcessedData.current === result.data) {
          lastProcessedData.current = "";
        }
      }, 500);

      // Try to parse the QR code data
      let chunkData: FileChunk;
      try {
        chunkData = JSON.parse(result.data) as FileChunk;
        console.log("Successfully parsed QR data, chunk:", chunkData.index);
      } catch (parseError) {
        console.error("Error parsing QR code data:", parseError);
        showFeedback("Invalid QR code format", "warning");
        return;
      }

      // Update file metadata if not already set
      if (!fileMetadata) {
        // Store file metadata
        const metadata: FileMetadata = {
          fileName: chunkData.fileName,
          fileType: chunkData.fileType || "application/octet-stream",
          fileSize: chunkData.fileSize,
          totalChunks: chunkData.totalChunks,
          fileExtension: chunkData.fileExtension || "",
        };

        console.log("Received file metadata:", metadata);
        setFileMetadata(metadata);

        // Initialize progress
        setProgress({
          received: 0,
          total: chunkData.totalChunks,
        });

        // Show feedback for first chunk
        showFeedback(`Started receiving file: ${metadata.fileName}`, "info");

        // Scroll to progress section when first chunk is received
        setTimeout(() => {
          if (progressSectionRef.current) {
            progressSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 300);
      } else {
        // Verify the file type is consistent across chunks
        if (fileMetadata.fileType !== chunkData.fileType) {
          console.warn("File type mismatch between chunks:", {
            stored: fileMetadata.fileType,
            current: chunkData.fileType,
          });
        }
      }

      // Check if this is a new chunk
      if (!receivedChunks[chunkData.index]) {
        // Add the new chunk
        setReceivedChunks(prev => {
          const updated = { ...prev, [chunkData.index]: chunkData.data };
          return updated;
        });

        // Update progress counter
        setProgress(prev => ({
          ...prev,
          received: Object.keys(receivedChunks).length + 1,
        }));

        // Set last scanned index
        setLastScannedIndex(chunkData.index);

        // Calculate how many chunks are now received
        const newTotalReceived = Object.keys(receivedChunks).length + 1;

        // Check if all chunks are now received
        if (fileMetadata && newTotalReceived >= fileMetadata.totalChunks) {
          // Don't show individual chunk feedback as we'll show the "all done" feedback
          return;
        }

        // Only show feedback for milestone chunks (every 5th chunk or custom logic)
        const isMilestone =
          newTotalReceived % 5 === 0 || // Every 5 chunks
          newTotalReceived === 1 || // First chunk
          (fileMetadata && newTotalReceived === Math.floor(fileMetadata.totalChunks / 2)); // Halfway point

        if (isMilestone) {
          if (fileMetadata) {
            const percentComplete = Math.round((newTotalReceived / fileMetadata.totalChunks) * 100);
            showFeedback(`${percentComplete}% complete (${newTotalReceived}/${fileMetadata.totalChunks})`, "info");
          } else {
            showFeedback(`Chunk ${chunkData.index + 1} received`, "info");
          }
        }
      } else {
        // This chunk was already scanned
        showFeedback(`Chunk ${chunkData.index + 1} already scanned`, "warning");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      showFeedback("Error processing QR code", "warning");
    }
  };

  // Reassemble and download the file
  const downloadFile = (): void => {
    if (!fileMetadata) return;

    console.log("Starting download with metadata:", fileMetadata);

    // Check if we have all chunks
    if (Object.keys(receivedChunks).length < fileMetadata.totalChunks) {
      const missingCount = fileMetadata.totalChunks - Object.keys(receivedChunks).length;
      showFeedback(`Missing ${missingCount} chunks. Cannot download yet.`, "warning");
      return;
    }

    // Assemble file from chunks
    const combinedArray = assembleFileFromChunks(receivedChunks, fileMetadata.totalChunks);

    if (!combinedArray) {
      showFeedback(`Some chunks are missing. Cannot download yet.`, "warning");
      return;
    }

    console.log("Assembling file from chunks...");
    showFeedback("Preparing file for download...", "info");

    // Use the file type from metadata
    const fileType = fileMetadata.fileType;
    console.log("Using file type:", fileType);

    // Create the blob with the proper MIME type
    const blob = new Blob([combinedArray], {
      type: fileType,
    });

    // Get the original filename
    let filename = fileMetadata.fileName;

    // If filename doesn't have an extension but we have one, add it
    if (fileMetadata.fileExtension && !filename.endsWith(`.${fileMetadata.fileExtension}`)) {
      filename = `${filename}.${fileMetadata.fileExtension}`;
    }

    console.log("Using filename for download:", filename);

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    // Log download details
    console.log("Downloading file:", {
      name: a.download,
      type: fileType,
      extension: fileMetadata.fileExtension,
      size: combinedArray.length + " bytes",
    });

    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showFeedback(`File "${filename}" downloaded successfully!`, "success");
  };

  // Reset the receiver
  const resetReceiver = (): void => {
    setReceivedChunks({});
    setFileMetadata(null);
    setProgress({ received: 0, total: 0 });
    setLastScannedIndex(-1);
    setDownloadReady(false);
    showFeedback("Scanner reset. Ready for new file.", "info");
  };

  // Get missing chunks
  const getMissingChunks = (): number[] => {
    if (!fileMetadata) return [];

    const missing: number[] = [];
    for (let i = 0; i < fileMetadata.totalChunks; i++) {
      if (!receivedChunks[i]) {
        missing.push(i);
      }
    }
    return missing;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-900 rounded-xl shadow-lg border border-zinc-600/25">
      <QRScanner scanning={scanning} onScan={handleScan} onToggleScanning={toggleScanning} />

      <div className="flex justify-between">
        <button
          onClick={resetReceiver}
          className="px-2 py-1.5 pr-2.5 cursor-pointer bg-zinc-700 text-zinc-200 rounded-md text-sm hover:bg-zinc-600 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>

        {downloadReady && (
          <button
            onClick={downloadFile}
            className="px-2 py-1.5 pr-2.5  cursor-pointer bg-green-700 text-white rounded-md text-sm hover:bg-green-600 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download File
          </button>
        )}
      </div>

      {fileMetadata && (
        <div ref={progressSectionRef} className="scroll-mt-4">
          {" "}
          {/* Added ref and scroll margin */}
          <MetadataDisplay
            fileMetadata={fileMetadata}
            receivedChunks={receivedChunks}
            lastScannedIndex={lastScannedIndex}
          />
          <ChunkDisplay
            receivedChunks={receivedChunks}
            totalChunks={fileMetadata.totalChunks}
            missingChunks={getMissingChunks()}
          />
          {downloadReady && (
            <div className="mt-4 p-5 bg-green-900/40 border border-green-700 rounded-lg">
              <div className="flex items-center text-green-300 font-bold mb-3">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                File is ready for download!
              </div>
              <p className="text-green-200 mb-3">
                All chunks have been successfully received and the file is ready to be downloaded.
              </p>
              <button
                onClick={downloadFile}
                className="w-full py-3 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Complete File
              </button>
            </div>
          )}
        </div>
      )}

      {!fileMetadata && !scanning && (
        <Collapse title="How to Scan QR Codes">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click "Start Scanning" to activate your camera</li>
            <li>Point your camera at the QR codes displayed by the sender</li>
            <li>The app will automatically capture and process each code</li>
            <li>Once all chunks are received, click "Download Complete File"</li>
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
                For best results, hold your camera steady and ensure QR codes are clearly visible in the scan area.
              </span>
            </div>
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default QRCodeReceiver;
