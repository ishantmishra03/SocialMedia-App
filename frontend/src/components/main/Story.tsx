"use client";

import { useColorMode } from "@/contexts/ThemeContext";

const stories = [
  { id: 1, name: "Your Story", image: "/profile.webp", isOwn: true },
  { id: 2, name: "john_doe", image: "/profile.webp" },
  { id: 3, name: "sarah_wilson", image: "/profile.webp" },
  { id: 4, name: "mike_chen", image: "/profile.webp" },
  { id: 5, name: "emma_davis", image: "/profile.webp" },
];

export default function Story() {
    const { isDarkMode } = useColorMode();
  return (
    <div
      className={`rounded-lg border mb-6 p-4 ${
        isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 text-center cursor-pointer group"
          >
            <div
              className={`relative w-16 h-16 rounded-full p-0.5 mb-2 ${
                story.isOwn
                  ? isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-300"
                  : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
              }`}
            >
              <div
                className={`w-full h-full rounded-full border-2 overflow-hidden ${
                  isDarkMode ? "border-black" : "border-white"
                }`}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center text-xs font-medium ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {story.name.charAt(0).toUpperCase()}
                </div>
              </div>
              {story.isOwn && (
                <div
                  className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isDarkMode
                      ? "bg-blue-500 border-black"
                      : "bg-blue-500 border-white"
                  }`}
                >
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              )}
            </div>
            <p
              className={`text-xs truncate w-16 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {story.isOwn ? "Your story" : story.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
