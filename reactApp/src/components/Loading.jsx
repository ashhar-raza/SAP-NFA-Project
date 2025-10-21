// Loading.jsx
import React from "react";

export default function Loading({ message = "Loading, please wait..." }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50"
      style={{ minHeight: "calc(100vh - 180px)" }}>

      {/* Gradient Bouncing Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-bounce-glow shadow-lg"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-blue-200 border-t-transparent animate-spin"></div>
      </div>

      {/* Loading Text */}
      <p className="text-gray-700 text-lg font-semibold">{message}</p>
      <p className="text-gray-400 text-sm mt-1">Fetching data from server...</p>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes bounce-glow {
            0%, 100% { transform: translateY(0); box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
            50% { transform: translateY(-15px); box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
          }
          .animate-bounce-glow {
            animation: bounce-glow 1s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
