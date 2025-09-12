"use client";

import React from "react";
import { useColorMode } from "@/contexts/ThemeContext";

export default function Loader() {
  const { isDarkMode } = useColorMode();

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
        isDarkMode ? "bg-gray-900 bg-opacity-80 text-gray-200" : "bg-white bg-opacity-80 text-gray-800"
      }`}
    >
      <div
        className={`h-16 w-16 rounded-full border-4 border-t-transparent animate-spin ${
          isDarkMode
            ? "border-gray-300 border-t-gray-700"
            : "border-gray-700 border-t-gray-300"
        }`}
      />

      <span className="mt-4 text-lg font-medium select-none">
        Loading...
      </span>
    </div>
  );
}
