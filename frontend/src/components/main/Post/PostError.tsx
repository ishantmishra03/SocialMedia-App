"use client";

import { useColorMode } from "@/contexts/ThemeContext";
import { RefreshCw, TrendingUp } from "lucide-react";

interface PostErrorProps {
  error: string | null;
  handleRefresh: () => void;
}

export default function PostError({ error, handleRefresh }: PostErrorProps) {
  const { isDarkMode } = useColorMode();
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`rounded-lg border p-8 text-center ${
          isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          }`}
        >
          <TrendingUp
            size={24}
            className={isDarkMode ? "text-gray-600" : "text-gray-400"}
          />
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Unable to load feed
        </h3>
        <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {error}
        </p>
        <button
          onClick={handleRefresh}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );
}
