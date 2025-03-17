export interface FileChunk {
  index: number;
  totalChunks: number;
  data: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileExtension?: string;
}

export interface FileMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  totalChunks: number;
  fileExtension?: string;
}

export interface ProgressState {
  received: number;
  total: number;
}
