import { FileChunk } from "../types";
import { getFileExtension, getMimeTypeExtension } from "./data-utils";
import { base64ToBuffer, bufferToBase64 } from "./encoder";

/**
 * Split file data into chunks ready for QR code generation
 */
export const chunkData = (
  data: ArrayBuffer,
  chunkSize: number,
  fileMetadata: { name?: string; type?: string; size?: number }
): string[] => {
  const array = new Uint8Array(data);
  const chunks: string[] = [];
  const totalChunks = Math.ceil(array.length / chunkSize);

  const fileName = fileMetadata.name || "unknown";
  const fileType = fileMetadata.type || "application/octet-stream";
  const fileSize = fileMetadata.size || 0;

  for (let i = 0; i < totalChunks; i++) {
    const begin = i * chunkSize;
    const end = Math.min(begin + chunkSize, array.length);
    const chunk = array.slice(begin, end);

    const chunkObj: FileChunk = {
      index: i,
      totalChunks,
      data: bufferToBase64(chunk),
      fileName,
      fileType,
      fileSize,
      fileExtension: getFileExtension(fileName) || getMimeTypeExtension(fileType) || undefined,
    };

    if (i === 0) {
      console.log("Sending file type:", fileType);
      console.log("First chunk:", chunkObj);
    }

    const jsonString = JSON.stringify(chunkObj);

    if (jsonString.length > 1000) {
      console.warn(`Chunk ${i} data is large (${jsonString.length} chars). QR code may be difficult to scan.`);
    }

    chunks.push(jsonString);
  }

  return chunks;
};

/**
 * Reassemble file chunks into a single file
 */
export const assembleFileFromChunks = (
  receivedChunks: Record<number, string>,
  totalChunks: number
): Uint8Array | null => {
  const chunksArray = Array(totalChunks)
    .fill(null)
    .map((_, index) => receivedChunks[index]);

  if (chunksArray.some(chunk => !chunk)) {
    return null;
  }

  const binaryChunks = chunksArray.map(chunk => base64ToBuffer(chunk));

  const combinedLength = binaryChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  const combinedArray = new Uint8Array(combinedLength);

  let offset = 0;
  binaryChunks.forEach(chunk => {
    combinedArray.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  });

  return combinedArray;
};
