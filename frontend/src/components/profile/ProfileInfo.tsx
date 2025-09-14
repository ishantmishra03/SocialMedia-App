"use client";

import Image from "next/image";
import { IUser } from "@/types";
import { Settings } from "lucide-react";

interface ProfileInfoProps {
  user: IUser;
  postsCount: number;
  isDarkMode: boolean;
}

export default function ProfileInfo({
  user,
  postsCount,
  isDarkMode,
}: ProfileInfoProps) {
  return (
    <div
      className={`flex flex-col md:flex-row items-start gap-8 mb-12 ${
        isDarkMode ? "text-gray-100" : "text-gray-900"
      }`}
    >
      {/* Profile Picture */}
      <div className="flex justify-center md:justify-start w-full md:w-auto">
        <div
          className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 p-1 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="w-full h-full rounded-full overflow-hidden relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                fill
                className="object-cover pointer-events-none select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <h1
            className={`text-xl md:text-2xl font-light ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {user.username}
          </h1>
          <div className="flex gap-2">
            <button
              className={`px-6 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Edit Profile
            </button>
            <button
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mb-6">
          <div className="text-center">
            <div className="font-semibold text-lg">{postsCount}</div>
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              posts
            </div>
          </div>
          <div
            className={`text-center cursor-pointer hover:${
              isDarkMode ? "text-gray-200" : "text-gray-600"
            }`}
          >
            <div className="font-semibold text-lg">
              {user.followersCount || 0}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              followers
            </div>
          </div>
          <div
            className={`text-center cursor-pointer hover:${
              isDarkMode ? "text-gray-200" : "text-gray-600"
            }`}
          >
            <div className="font-semibold text-lg">
              {user.followingCount || 0}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              following
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className={`text-sm mb-4 ${isDarkMode ? "text-gray-200" : ""}`}>
            <p>{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
