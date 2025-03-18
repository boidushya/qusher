import { motion } from "framer-motion";
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
  // Convert playback speed to a displayable value (seconds)
  const displaySpeed = (playbackSpeed / 1000).toFixed(1);

  // Calculate progress percentage
  const progressPercentage = ((currentChunkIndex + 1) / totalChunks) * 100;

  return (
    <div className="mt-8 bg-zinc-800 rounded-lg border border-zinc-700 p-5">
      {/* Current Position Display */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-zinc-400">
          <span className="font-medium text-zinc-200">{currentChunkIndex + 1}</span>
          <span> / </span>
          <span>{totalChunks}</span>
          <span className="text-zinc-500 ml-1">QR codes</span>
        </div>
        <motion.span
          className="text-sm rounded-full px-3 py-0.5 bg-blue-900/50 border border-blue-700/30 text-blue-300"
          animate={{
            scale: isPlaying ? [1, 1.05, 1] : 1,
            opacity: isPlaying ? 1 : 0.7,
          }}
          transition={{
            scale: { repeat: Infinity, duration: 2 },
            opacity: { duration: 0.2 },
          }}
        >
          {isPlaying ? "Playing" : "Paused"}
        </motion.span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-700 rounded-full h-1.5 mb-6 overflow-hidden">
        <motion.div
          className="bg-blue-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ type: "spring", damping: 15 }}
        />
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <motion.button
          onClick={onReset}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:hover:bg-zinc-700"
          title="Reset to First"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.button
          onClick={onPrevious}
          disabled={currentChunkIndex <= 0}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:hover:bg-zinc-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.button
          onClick={onTogglePlay}
          whileTap={{ scale: 0.9 }}
          className={`p-4 rounded-full ${isPlaying ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600" : "bg-blue-600 text-white hover:bg-blue-500"} transition-colors shadow-lg`}
        >
          {isPlaying ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </motion.button>

        <motion.button
          onClick={onNext}
          disabled={currentChunkIndex >= totalChunks - 1 && !isLooping}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:hover:bg-zinc-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        <motion.button
          onClick={onToggleLoop}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${isLooping ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"} transition-colors`}
          title={isLooping ? "Looping Enabled" : "Looping Disabled"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </motion.button>
      </div>

      {/* Playback Speed Control */}
      <div className="bg-zinc-700/50 rounded-lg p-4 border border-zinc-600/50">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-zinc-300">Playback Speed</label>
          <div className="bg-blue-900/50 border border-blue-800/30 rounded px-2 py-0.5 text-blue-300 text-sm font-medium">
            {displaySpeed}s per QR
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
            />
          </svg>

          <input
            type="range"
            min="200"
            max="3000"
            step="100"
            value={playbackSpeed}
            onChange={e => onSpeedChange(Number(e.target.value))}
            className="w-full appearance-none h-2 bg-zinc-600 rounded-lg focus:outline-none"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((playbackSpeed - 200) / 2800) * 100}%, #374151 ${((playbackSpeed - 200) / 2800) * 100}%, #374151 100%)`,
            }}
          />
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>Faster</span>
          <span>Slower</span>
        </div>
      </div>

      {/* Transfer Estimate */}
      <div className="mt-4 text-center text-xs text-zinc-500">
        Estimated transfer time: ~{Math.ceil(totalChunks * (playbackSpeed / 1000))} seconds at current speed
      </div>
    </div>
  );
};
