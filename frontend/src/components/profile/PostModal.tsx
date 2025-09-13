"use client";

import Image from "next/image";
import { IPost } from "@/types";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

interface PostModalProps {
  post: IPost;
  isLiked: boolean;
  isSaved: boolean;
  closeModal: () => void;
  navigatePost: (direction: 'prev' | 'next') => void;
  handleLike: () => void;
  handleSave: () => void;
  currentIndex: number;
  totalPosts: number;
  formatDate: (dateString: string) => string;
}

export default function PostModal({
  post,
  isLiked,
  isSaved,
  closeModal,
  navigatePost,
  handleLike,
  handleSave,
  currentIndex,
  totalPosts,
  formatDate
}: PostModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white w-full max-w-6xl h-full max-h-screen flex relative">
        {/* Image Section */}
        <div className="flex-1 flex items-center justify-center bg-black">
          {post.media?.url ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image src={post.media.url} alt={post.content || "Post image"} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
              No Media Available
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                {post.author.avatar ? (
                  <Image src={post.author.avatar} alt={post.author.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {post.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-semibold text-sm">{post.author.username}</span>
            </div>
            <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Caption */}
          <div className="flex-1 p-4">
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0">
                {post.author.avatar ? (
                  <Image src={post.author.avatar} alt={post.author.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {post.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm mr-2">{post.author.username}</span>
                <span className="text-sm">{post.content}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">{formatDate(post.createdAt)}</div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-4">
                <button onClick={handleLike} className="hover:text-gray-600 transition-colors">
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="hover:text-gray-600 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="hover:text-gray-600 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              <button onClick={handleSave} className="hover:text-gray-600 transition-colors">
                <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-black' : ''}`} />
              </button>
            </div>
            <div className="px-4 pb-4">
              <div className="font-semibold text-sm mb-1">{(post.likes?.length || 0)} likes</div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button onClick={() => navigatePost('prev')} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg bg-white hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {currentIndex < totalPosts - 1 && (
          <button onClick={() => navigatePost('next')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg bg-white hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
