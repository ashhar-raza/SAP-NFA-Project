import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({ message, onRetry }) {
  // Default message handling
  const displayMessage =
    message && typeof message === "string"
      ? message
      : "Failed to fetch data from the server.";

  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-50 px-4"
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
      {/* Animated Gradient Icon */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 opacity-30 animate-pulse"></div>
        <AlertCircle className="w-12 h-12 text-red-500 animate-pulse relative z-10" />
      </div>

      {/* Error Message */}
      <p className="text-red-600 text-lg font-semibold mb-2 text-center">
        {displayMessage}
      </p>

      {/* Supportive Text */}
      <p className="text-gray-400 text-sm text-center mb-4">
        Please check your network connection or try again later.
      </p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
        >
          <RefreshCw size={18} /> Retry
        </button>
      )}
    </div>
  );
}
