// PlaybackControls.tsx
import React from "react";

interface PlaybackControlsProps {
  currentChunkIndex: number;
  totalChunks: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isLooping: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleLoop: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentChunkIndex,
  totalChunks,
  isPlaying,
  playbackSpeed,
  isLooping,
  onPrevious,
  onNext,
  onTogglePlay,
  onToggleLoop,
  onSpeedChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevious}
          disabled={currentChunkIndex <= 0}
          className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button onClick={onTogglePlay} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={onNext}
          disabled={currentChunkIndex >= totalChunks - 1 && !isLooping}
          className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="mt-4 w-full max-w-xs">
        <label className="block text-sm text-zinc-200 mb-2">Playback Speed: {playbackSpeed}ms</label>
        <input
          type="range"
          min="200"
          max="3000"
          step="100"
          value={playbackSpeed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mt-4 flex items-center justify-between w-full max-w-xs">
        <div className="flex items-center">
          <input type="checkbox" id="loop-checkbox" checked={isLooping} onChange={onToggleLoop} className="mr-2" />
          <label htmlFor="loop-checkbox" className="text-sm text-zinc-200">
            Loop Playback
          </label>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1 bg-zinc-800 rounded text-sm hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          Reset to First
        </button>
      </div>
    </div>
  );
};
