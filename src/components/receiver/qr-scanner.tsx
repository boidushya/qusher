import QrScanner from "qr-scanner";
import React, { useRef, useEffect } from "react";

interface QRScannerProps {
  scanning: boolean;
  onScan: (result: QrScanner.ScanResult) => void;
  onToggleScanning: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ scanning, onScan, onToggleScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = React.useState<QrScanner | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [cameras, setCameras] = React.useState<QrScanner.Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = React.useState<string>("");

  // Initialize scanner
  useEffect(() => {
    if (videoRef.current && !scanner) {
      // Configure QR scanner with continuous scanning option
      const qrScanner = new QrScanner(
        videoRef.current,
        result => {
          onScan(result);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment", // Prefer back camera on mobile
          maxScansPerSecond: 5, // Limit scan rate to avoid performance issues
        }
      );

      setScanner(qrScanner);
      scannerRef.current = qrScanner;

      // Get available cameras
      QrScanner.listCameras()
        .then(cameras => {
          setCameras(cameras);
          if (cameras.length > 0) {
            // By default, select environment camera if available, otherwise first camera
            const environmentCamera = cameras.find(camera => camera.id.includes("environment"));
            setSelectedCamera(environmentCamera ? environmentCamera.id : cameras[0].id);
          }
        })
        .catch(err => {
          console.error("Failed to list cameras:", err);
        });
    }

    // Cleanup on component unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle camera change
  useEffect(() => {
    if (scanner && selectedCamera) {
      const wasScanning = scanning;
      if (wasScanning) {
        scanner.stop();
      }

      scanner
        .setCamera(selectedCamera)
        .then(() => {
          if (wasScanning) {
            scanner.start();
          }
        })
        .catch(error => {
          console.error("Error changing camera:", error);
        });
    }
  }, [selectedCamera, scanner, scanning]);

  // Handle scanning toggle
  useEffect(() => {
    if (scanner) {
      if (scanning) {
        scanner.start().catch(error => {
          console.error("Error starting camera:", error);
          // Handle camera access errors
          if (error.name === "NotAllowedError") {
            alert("Camera access was denied. Please allow camera access and try again.");
          } else if (error.name === "NotFoundError") {
            alert("No camera found on this device.");
          } else {
            alert(`Camera error: ${error.message}`);
          }
        });
      } else {
        scanner.stop();
      }
    }
  }, [scanning, scanner]);

  return (
    <div className="mb-4 relative">
      <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
        <video ref={videoRef} className="w-full h-96 object-cover rounded-md" />

        {/* Camera Disabled Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!scanning && (
            <div className="bg-zinc-900 bg-opacity-80 p-5 mt-12 rounded-lg text-zinc-100 text-center max-w-xs">
              <svg className="w-12 h-12 mx-auto mb-2 text-zinc-400" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2m14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1M20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3M2 9a1 1 0 0 0 1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1m8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1a1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1m4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-4 4a1 1 0 1 0 1 1a1 1 0 0 0-1-1"
                ></path>
              </svg>
              <p className="font-medium">Camera is off</p>
              <p className="text-sm text-zinc-400 mt-1">Click the button above to start scanning QR codes</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[calc(100%_-_2rem)] m-4 flex flex-wrap gap-3 items-center justify-between">
        <button
          onClick={onToggleScanning}
          className={`px-2 py-1.5 pr-2.5 rounded-md cursor-pointer transition-colors flex items-center text-sm ${
            scanning ? "bg-red-700 hover:bg-red-600 text-white" : "bg-green-700 hover:bg-green-600 text-white"
          }`}
        >
          {scanning ? (
            <>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              Stop Scanning
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Start Scanning
            </>
          )}
        </button>

        {cameras.length > 1 && !scanning && (
          <div className="flex items-center space-x-2">
            <label htmlFor="camera-select" className="text-zinc-300 text-sm">
              Camera:
            </label>
            <select
              id="camera-select"
              value={selectedCamera}
              onChange={e => setSelectedCamera(e.target.value)}
              className="bg-zinc-800 border border-zinc-600 text-zinc-200 text-sm rounded-md px-2 py-1.5"
              disabled={scanning}
            >
              {cameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || (camera.id.includes("environment") ? "Back Camera" : "Front Camera")}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {scanning && (
        <div className="mt-4 px-3 py-2 bg-zinc-800 rounded-md text-zinc-300 text-sm flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-blue-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Scanning for QR codes. Center the code in the highlighted area for best results.
        </div>
      )}
    </div>
  );
};
