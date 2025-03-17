import React, { useState } from "react";

interface CollapseProps {
  children: React.ReactNode;
  title?: string;
}

export const Collapse: React.FC<CollapseProps> = ({ children, title = "Instructions" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6 bg-zinc-800 rounded-lg border border-zinc-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-3 text-left flex items-center justify-between focus:outline-none"
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-bold text-zinc-100">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-5 pb-5 text-zinc-300">{children}</div>
      </div>
    </div>
  );
};
