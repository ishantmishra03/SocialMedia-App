'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "@/lib/axios";
import { IUser } from "@/types";
import { Settings } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

interface ProfileInfoProps {
  user: IUser;
  postsCount: number;
  isDarkMode: boolean;
}

type FollowStatus = "not_following" | "following" | "follow_back";

export default function ProfileInfo({ user, postsCount, isDarkMode }: ProfileInfoProps) {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [followStatus, setFollowStatus] = useState<FollowStatus>("not_following");
  const [loadingFollow, setLoadingFollow] = useState(false);

  const isOwnProfile = currentUser?._id === user._id;

  useEffect(() => {
    if (!currentUser || isOwnProfile) return;

    const checkFollow = async () => {
      try {
        const res = await axios.get(`/api/user/check-follow/${user._id}`);
        if (res.data.success) {
          setFollowStatus(
            res.data.isFollowing ? "following" : res.data.followBack ? "follow_back" : "not_following"
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkFollow();
  }, [currentUser, user, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    setLoadingFollow(true);

    try {
      if (followStatus === "following") {
        await axios.post(`/api/user/unfollow/${user._id}`);
        setFollowStatus("not_following");
      } else {
        await axios.post(`/api/user/follow/${user._id}`);
        setFollowStatus("following");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row items-start gap-6 mb-12 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
      {/* Profile Picture */}
      <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 p-1 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
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

      {/* Profile Info */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-light ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {user.username}
          </h1>

          {/* Buttons */}
          <div className="flex gap-2 mt-2 sm:mt-0">
            {isOwnProfile ? (
              <>
                <button className={`px-4 sm:px-6 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-100" : "bg-gray-100 hover:bg-gray-200 text-gray-900"}`}>
                  Edit Profile
                </button>
                <button className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                  <Settings className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={loadingFollow}
                className={`px-4 sm:px-6 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  followStatus === "following"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : followStatus === "follow_back"
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {followStatus === "following" ? "Following" : followStatus === "follow_back" ? "Follow Back" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 md:gap-8 text-sm sm:text-base">
          <div className="text-center">
            <div className="font-semibold">{postsCount}</div>
            <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>posts</div>
          </div>
          <div className="text-center cursor-pointer">
            <div className="font-semibold">{user.followersCount || 0}</div>
            <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>followers</div>
          </div>
          <div className="text-center cursor-pointer">
            <div className="font-semibold">{user.followingCount || 0}</div>
            <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>following</div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className={`text-sm mt-2 ${isDarkMode ? "text-gray-200" : ""}`}>
            <p>{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
