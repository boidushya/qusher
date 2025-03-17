/**
 * Calculates the optimal chunk size for a given file type
 * Different file types may benefit from different chunk sizes
 */
export function calculateOptimalChunkSize(fileType: string): number {
  // Text files can use smaller chunks as they compress well
  if (fileType.startsWith("text/")) {
    return 512;
  }

  // Binary files need smaller chunks to ensure QR codes don't get too dense
  if (fileType.includes("image/") || fileType.includes("audio/") || fileType.includes("video/")) {
    return 128;
  }

  // Default size for other file types
  return 256;
}

/**
 * Estimates the number of QR codes needed for a given file size
 */
export function estimateQRCodeCount(fileSize: number, chunkSize: number): number {
  return Math.ceil(fileSize / chunkSize);
}

/**
 * Converts an error message to a user-friendly format
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Simple timer utility to measure scanning performance
 */
export class ScanTimer {
  private startTime = 0;
  private scans = 0;

  start(): void {
    this.startTime = Date.now();
    this.scans = 0;
  }

  recordScan(): void {
    this.scans++;
  }

  getStats(): { scans: number; elapsed: number; scansPerSecond: number } {
    const elapsed = (Date.now() - this.startTime) / 1000;
    return {
      scans: this.scans,
      elapsed,
      scansPerSecond: elapsed > 0 ? this.scans / elapsed : 0,
    };
  }
}

/**
 * Creates a unique ID for a file transfer session
 */
export function generateTransferId(): string {
  return `transfer-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
}

/**
 * Gets a file extension from a filename
 */
export function getFileExtension(filename: string): string | null {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || null : null;
}

/**
 * Maps common MIME types to file extensions
 */
export const mimeToExtensionMap: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "text/plain": "txt",
  "text/html": "html",
  "text/css": "css",
  "text/javascript": "js",
  "application/json": "json",
  "application/xml": "xml",
  "application/zip": "zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export function getMimeTypeExtension(mimeType: string): string | null {
  return mimeType in mimeToExtensionMap ? mimeToExtensionMap[mimeType] : null;
}
