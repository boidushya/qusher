import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const animationVariants = {
  initial: { opacity: 0, scale: 0, height: "0", marginTop: 0 },
  animate: { opacity: 1, scale: 1, height: "auto", marginTop: 16 },
  exit: { opacity: 0, scale: 0, height: "0", marginTop: 0 },
};

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        setFileSize(file.size);
        console.log("Selected file:", file.name, "Type:", file.type);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12
          transition-all duration-200 ease-in-out
          ${dragActive ? "border-blue-500 bg-blue-950 bg-opacity-10" : "border-zinc-600 hover:border-blue-400"}
          cursor-pointer flex flex-col items-center justify-center
        `}
      >
        <input {...getInputProps()} />

        <div className="text-center">
          {!fileName ? (
            <>
              <svg
                className="mx-auto h-8 w-8 text-zinc-400"
                stroke="currentColor"
                fill="none"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                  <path d="M17 9.002c2.175.012 3.353.109 4.121.877C22 10.758 22 12.172 22 15v1c0 2.829 0 4.243-.879 5.122C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.878C2 20.242 2 18.829 2 16v-1c0-2.828 0-4.242.879-5.121c.768-.768 1.946-.865 4.121-.877"></path>
                  <path stroke-linejoin="round" d="M12 15V2m0 0l3 3.5M12 2L9 5.5"></path>
                </g>
              </svg>
              <p className="mt-2 text-zinc-300">Drag and drop a file here, or click to select</p>
              <p className="mt-1 text-zinc-500 text-sm">Any file format is supported</p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-2">
                <svg className="h-8 w-8 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-zinc-200 font-medium">File selected</span>
              </div>
              <p className="text-zinc-300 text-sm truncate max-w-full">{fileName}</p>
              {fileSize && <p className="text-zinc-400 text-xs mt-1">{formatFileSize(fileSize)}</p>}
              <p className="mt-3 text-blue-400 text-sm">Click or drag a new file to replace</p>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isDragActive && (
          <motion.div
            variants={animationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center text-blue-400 text-sm animate-pulse origin-top"
          >
            Drop the file here...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
