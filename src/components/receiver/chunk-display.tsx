import NumberFlow from "@number-flow/react";
import React from "react";

interface ChunkDisplayProps {
  receivedChunks: Record<number, string>;
  totalChunks: number;
  missingChunks: number[];
}

export const ChunkDisplay: React.FC<ChunkDisplayProps> = ({ receivedChunks, totalChunks, missingChunks }) => {
  const completionPercentage = Math.round((Object.keys(receivedChunks).length / totalChunks) * 100);
  const receivedCount = Object.keys(receivedChunks).length;

  const allChunks = Array.from({ length: totalChunks }, (_, i) => i);

  return (
    <div className="mt-6 p-5 bg-zinc-800 rounded-lg border border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-zinc-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Chunks Status
        </h3>
        <div className="text-sm text-blue-300 font-medium flex items-center whitespace-pre">
          <NumberFlow value={receivedCount} className="inline-block" /> /{" "}
          <NumberFlow value={totalChunks} className="inline-block" /> received (
          <NumberFlow value={completionPercentage} className="inline-block" />
          %)
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {allChunks.map(index => (
          <div
            key={index}
            className={`w-8 h-8 shrink-0 grow-0 flex items-center justify-center text-xs rounded transition-all duration-200
              ${
                receivedChunks[index]
                  ? "bg-green-600 text-white shadow-sm shadow-green-900/40"
                  : "bg-zinc-600 text-zinc-300 hover:bg-zinc-500"
              }`}
            title={`Chunk ${index + 1}${receivedChunks[index] ? " - Received" : " - Missing"}`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {missingChunks.length > 0 && missingChunks.length < totalChunks && (
        <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/30 rounded-md">
          <p className="text-yellow-300 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="flex-1">
              Missing chunks:
              <NumberFlow value={missingChunks.length} className="mx-1 font-medium" />
              <span className="ml-1 break-words">
                {missingChunks.length > 10
                  ? `${missingChunks.slice(0, 10).join(", ")}... and ${missingChunks.length - 10} more`
                  : missingChunks.join(", ")}
              </span>
            </span>
          </p>
        </div>
      )}

      {missingChunks.length === 0 && totalChunks > 0 && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-700/30 rounded-md">
          <p className="text-green-300 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>All chunks successfully received! The file is complete.</span>
          </p>
        </div>
      )}
    </div>
  );
};
