"use client";

import { useState, useRef, useEffect } from "react";
import { useColorMode } from "@/contexts/ThemeContext";
import { IPost } from "@/types/index";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share,
  Copy,
  Eye,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import { updatePostLikes } from "@/store/slices/post.slice";
import Link from "next/link";

interface PostCardProps {
  post: IPost;
}

export default function PostCard({ post }: PostCardProps) {
  const { isDarkMode } = useColorMode();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Local state
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user?._id || "") || false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Intersection observer for autoplay video
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (videoRef.current) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            videoRef.current.play().catch(() => {});
            setIsVideoPlaying(true);
          } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
          }
        }
      },
      { threshold: [0.1, 0.5, 0.9] }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Toggle like
  const toggleLike = async () => {
    try {
      const endpoint = isLiked
        ? `/api/posts/${post._id}/unlike`
        : `/api/posts/${post._id}/like`;
      const { data } = await axios.post(endpoint);

      if (data.success) {
        toast.info(data.message);
        setIsLiked(!isLiked);
        setLikeCount(data.data.likes.length);
        dispatch(updatePostLikes({ postId: post._id, likes: data.data.likes }));
      }
    } catch (error) {
      toast.error("Failed to like/unlike post");
      console.error(error);
    }
  };

  const handleSave = () => setIsSaved(!isSaved);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoMuted(!isVideoMuted);
    if (videoRef.current) videoRef.current.muted = !isVideoMuted;
  };

  // Derived values
  const isVideo = post.media?.resourceType === "video";
  const contentText = post.content || "";
  const shouldTruncateContent = contentText.length > 150;
  const timeAgo = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      new Date(post.createdAt).getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });
  const commentCount = post.comments?.length || 0;

  return (
    <article
      ref={cardRef}
      className={`group relative w-full max-w-lg mx-auto transition-all duration-300 ease-out transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-95 scale-[0.98]"
      } ${
        isDarkMode
          ? "bg-gray-900/80 backdrop-blur-sm border-gray-800/50 text-white"
          : "bg-white/90 backdrop-blur-sm border-gray-200/50 text-gray-900"
      } border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:max-w-md md:max-w-lg`}
      role="article"
      aria-label={`Post by ${post.author?.username}`}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <div
              className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                isDarkMode
                  ? "border-gray-700 group-hover:border-gray-600"
                  : "border-gray-200 group-hover:border-gray-300"
              }`}
            >
              <Image
                src={post.author?.avatar || "/profile.webp"}
                alt={`${post.author.username}'s avatar`}
                width={44}
                height={44}
                className="w-full h-full object-cover pointer-events-none select-none"
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <Link href={`/u/${post.author.username}`}>
              <h3 className="font-semibold text-sm truncate">
              {post.author.username}
            </h3>
            </Link>
            <div className="flex items-center space-x-1 text-xs">
              <Clock
                size={12}
                className={isDarkMode ? "text-gray-500" : "text-gray-400"}
              />
              <time className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                {timeAgo}
              </time>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isDarkMode
                ? "hover:bg-gray-800 active:bg-gray-700"
                : "hover:bg-gray-100 active:bg-gray-200"
            }`}
          >
            <MoreHorizontal size={18} />
          </button>
          {showShareMenu && (
            <div
              className={`absolute right-0 top-12 w-40 py-2 rounded-xl shadow-lg z-10 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border`}
            >
              <button
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Share size={16} />
                <span>Share</span>
              </button>
              <button
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Copy size={16} />
                <span>Copy link</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Media */}
      <div className="relative bg-black">
        {isVideo && post.media ? (
          <div className="relative aspect-square">
            <video
              ref={videoRef}
              className="w-full h-full object-cover cursor-pointer"
              muted={isVideoMuted}
              loop
              playsInline
              onClick={handleVideoClick}
              poster={post.media.url}
              onLoadStart={() => setImageError(false)}
              onError={() => setImageError(true)}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              controls={false}
            >
              <source src={post.media.url} type="video/mp4" />
            </video>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleVideoClick}
                className="p-4 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
              >
                {isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isDarkMode
                    ? "bg-black/60 text-white hover:bg-black/80"
                    : "bg-white/80 text-black hover:bg-white/90"
                }`}
              >
                {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            <div className="absolute bottom-4 left-4">
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm ${
                  isDarkMode
                    ? "bg-black/60 text-white"
                    : "bg-white/80 text-black"
                }`}
              >
                <Eye size={14} />
                <span className="text-xs font-medium">1.2K</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-square">
            {!imageError && post.media ? (
              <Image
                src={post.media.url}
                alt={post.content || "Post image"}
                fill
                className="object-cover pointer-events-none select-none"
                loading="lazy"
                onError={() => setImageError(true)}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  >
                    <Eye
                      size={24}
                      className={isDarkMode ? "text-gray-500" : "text-gray-600"}
                    />
                  </div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Image unavailable
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleLike}
              className="group flex items-center space-x-2 transition-all duration-200 active:scale-95"
            >
              <Heart
                size={22}
                className={`transition-all duration-200 ${
                  isLiked
                    ? "text-red-500 fill-red-500 scale-110"
                    : isDarkMode
                    ? "text-gray-300 hover:text-red-400 group-hover:scale-110"
                    : "text-gray-700 hover:text-red-500 group-hover:scale-110"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isLiked
                    ? "text-red-500"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                {likeCount}
              </span>
            </button>

            <button className="group flex items-center space-x-2 transition-all duration-200 active:scale-95">
              <MessageCircle
                size={22}
                className={`transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-blue-400 group-hover:scale-110"
                    : "text-gray-700 hover:text-blue-500 group-hover:scale-110"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {commentCount}
              </span>
            </button>

            <button className="group transition-all duration-200 active:scale-95">
              <Send
                size={22}
                className={`transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-green-400 group-hover:scale-110 group-hover:rotate-12"
                    : "text-gray-700 hover:text-green-500 group-hover:scale-110 group-hover:rotate-12"
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="group transition-all duration-200 active:scale-95"
          >
            <Bookmark
              size={22}
              className={`transition-all duration-200 ${
                isSaved
                  ? "text-yellow-500 fill-yellow-500 scale-110"
                  : isDarkMode
                  ? "text-gray-300 hover:text-yellow-400 group-hover:scale-110"
                  : "text-gray-700 hover:text-yellow-500 group-hover:scale-110"
              }`}
            />
          </button>
        </div>

        {/* Like Count */}
        {likeCount > 0 && (
          <div className="mb-3">
            <p className="text-sm font-semibold">
              {likeCount === 1
                ? "1 like"
                : `${likeCount.toLocaleString()} likes`}
            </p>
          </div>
        )}

        {/* Post Content */}
        {contentText && (
          <div className="mb-3">
            <p
              className={`text-sm leading-relaxed ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {shouldTruncateContent && !showFullContent
                ? contentText.slice(0, 150) + "..."
                : contentText}
            </p>
            {shouldTruncateContent && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className={`mt-1 text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showFullContent ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {/* Comments */}
        {commentCount > 0 && (
          <button
            className={`text-sm mb-3 block transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            View all {commentCount} comments
          </button>
        )}

        {/* Engagement Stats */}
        <div
          className={`flex items-center justify-between pt-3 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-4 text-xs">
            <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              {timeAgo}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye
              size={12}
              className={isDarkMode ? "text-gray-400" : "text-gray-500"}
            />
            <span
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              1.2K views
            </span>
          </div>
        </div>
      </div>

      {showShareMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </article>
  );
}
