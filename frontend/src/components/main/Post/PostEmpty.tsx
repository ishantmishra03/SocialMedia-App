"use client";

import { useColorMode } from "@/contexts/ThemeContext";
import { Loader2, RefreshCw, Users } from "lucide-react";

interface PostEmptyProps{
    refreshing: boolean;
    handleRefresh: () => void;
}

export default function PostEmpty({ handleRefresh, refreshing }: PostEmptyProps) {
    const {isDarkMode} = useColorMode();
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`rounded-lg border p-12 text-center ${
          isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div
          className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          }`}
        >
          <Users
            size={32}
            className={isDarkMode ? "text-gray-600" : "text-gray-400"}
          />
        </div>
        <h3
          className={`text-2xl font-bold mb-3 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to SocialMedia
        </h3>
        <p
          className={`text-lg mb-8 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Start following people to see their posts in your feed
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            isDarkMode
              ? "bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500"
              : "bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400"
          }`}
        >
          {refreshing ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <RefreshCw size={16} className="mr-2" />
          )}
          {refreshing ? "Refreshing..." : "Refresh Feed"}
        </button>
      </div>
    </div>
  );
}
