'use client';

import Image from "next/image";
import { IPost } from "@/types";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useColorMode } from "@/contexts/ThemeContext";
import axios from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePostLikes } from "@/store/slices/post.slice";

interface PostModalProps {
  post: IPost;
  isSaved: boolean;
  closeModal: () => void;
  navigatePost: (direction: 'prev' | 'next') => void;
  handleSave: (postId: string) => void;
  currentIndex: number;
  totalPosts: number;
  formatDate: (dateString: string) => string;
}

export default function PostModal({
  post,
  isSaved,
  closeModal,
  navigatePost,
  handleSave,
  currentIndex,
  totalPosts,
  formatDate
}: PostModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { posts } = useAppSelector(state => state.post);
  const { isDarkMode } = useColorMode();

  const postFromStore = posts.find(p => p._id === post._id) || post;
  const likesCount = postFromStore.likes?.length || 0;
  const liked = postFromStore.likes?.includes(user?._id || '') || false;

  const toggleLike = async () => {
    try {
      const endpoint = liked ? `/api/posts/${post._id}/unlike` : `/api/posts/${post._id}/like`;
      const { data } = await axios.post(endpoint);
      if (data.success) {
        dispatch(updatePostLikes({ postId: post._id, likes: data.data.likes }));
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className={`w-full max-w-6xl h-full max-h-screen flex relative ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>

        {/* Media Section */}
        <div className="flex-1 flex items-center justify-center bg-black select-none pointer-events-none">
          {postFromStore.media?.url ? (
            postFromStore.media.resourceType === 'video' ? (
              <video
                controls
                className="w-full h-full object-contain"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src={postFromStore.media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={postFromStore.media.url}
                  alt={postFromStore.content || "Post image"}
                  fill
                  className="object-contain select-none pointer-events-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
              No Media Available
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-96 flex flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                {postFromStore.author.avatar ? (
                  <Image
                    src={postFromStore.author.avatar}
                    alt={postFromStore.author.username}
                    fill
                    className="object-cover select-none pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {postFromStore.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-semibold text-sm">{postFromStore.author.username}</span>
            </div>
            <button
              onClick={closeModal}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Caption */}
          <div className="flex-1 p-4">
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0">
                {postFromStore.author.avatar ? (
                  <Image
                    src={postFromStore.author.avatar}
                    alt={postFromStore.author.username}
                    fill
                    className="object-cover select-none pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {postFromStore.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm mr-2">{postFromStore.author.username}</span>
                <span className="text-sm">{postFromStore.content}</span>
              </div>
            </div>
            <div className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(postFromStore.createdAt)}</div>
          </div>

          {/* Actions */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-4">
                <button onClick={toggleLike} className={`transition-colors ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-600'}`}>
                  <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className={`transition-colors ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-600'}`}>
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className={`transition-colors ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-600'}`}>
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              <button onClick={() => handleSave(postFromStore._id)} className={`transition-colors ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-600'}`}>
                <Bookmark className={`w-6 h-6 ${isSaved ? (isDarkMode ? 'fill-white' : 'fill-black') : ''}`} />
              </button>
            </div>
            <div className="px-4 pb-4">
              <div className="font-semibold text-sm mb-1">{likesCount} likes</div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={() => navigatePost('prev')}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {currentIndex < totalPosts - 1 && (
          <button
            onClick={() => navigatePost('next')}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
