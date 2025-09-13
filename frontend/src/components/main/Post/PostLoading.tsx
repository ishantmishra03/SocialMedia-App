"use client";

import { useColorMode } from "@/contexts/ThemeContext";

export default function PostLoading() {
  const { isDarkMode } = useColorMode();
  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories Skeleton */}
      <div
        className={`rounded-lg border mb-6 p-4 ${
          isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div
                className={`w-16 h-16 rounded-full mb-2 animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-3 w-12 rounded animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Posts Skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-lg border ${
              isDarkMode
                ? "bg-black border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Post Header Skeleton */}
            <div className="flex items-center p-4 space-x-3">
              <div
                className={`w-8 h-8 rounded-full animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-4 w-24 rounded animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
            </div>

            {/* Post Image Skeleton */}
            <div
              className={`w-full h-96 animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />

            {/* Post Actions Skeleton */}
            <div className="p-4 space-y-3">
              <div className="flex space-x-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className={`w-6 h-6 rounded animate-pulse ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div
                className={`h-4 w-20 rounded animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-4 w-full rounded animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
