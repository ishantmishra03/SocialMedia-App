"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { IUser, IPost } from "@/types";
import { fetchUserPosts, setSelectedPost } from "@/store/slices/post.slice";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileModal from "@/components/profile/PostModal";
import Image from "next/image";
import { Grid, BookmarkIcon } from "lucide-react";
import axios from "@/lib/axios";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user: loginUser } = useAppSelector((state) => state.auth);
  const { posts, selectedPost, loading } = useAppSelector((state) => state.post);

  const [user, setUser] = useState<IUser | null>(null);
  const [savedPosts, setSavedPosts] = useState<IPost[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axios.get(`/api/user/${loginUser?.username}`);
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
    dispatch(fetchUserPosts());
  }, [loginUser?.username, dispatch]);

  const openPostModal = (post: IPost, index: number) => {
    dispatch(setSelectedPost(post));
    setCurrentPostIndex(index);
    setIsLiked(post.likes?.includes(loginUser?._id || '') || false);
    setIsSaved(user?.savedPosts?.includes(post._id) || false);
  };

  const closePostModal = () => dispatch(setSelectedPost(null));

  const navigatePost = (direction: 'prev' | 'next') => {
    const currentPosts = activeTab === 'posts' ? posts : savedPosts;
    if (direction === 'prev' && currentPostIndex > 0) {
      const newIndex = currentPostIndex - 1;
      setCurrentPostIndex(newIndex);
      dispatch(setSelectedPost(currentPosts[newIndex]));
    } else if (direction === 'next' && currentPostIndex < currentPosts.length - 1) {
      const newIndex = currentPostIndex + 1;
      setCurrentPostIndex(newIndex);
      dispatch(setSelectedPost(currentPosts[newIndex]));
    }
  };

  const handleLike = () => setIsLiked(!isLiked);
  const handleSave = () => setIsSaved(!isSaved);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) return (
    <div className="flex justify-center items-center min-h-screen text-red-500">
      Failed to load user profile.
    </div>
  );

  const currentPosts = activeTab === 'posts' ? posts : savedPosts;

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Profile Info */}
        <ProfileInfo user={user} postsCount={posts.length} isDarkMode={false} />

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex justify-center gap-16">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-wide border-t-2 transition-colors ${activeTab === 'posts' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-3 h-3" /> Posts
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-wide border-t-2 transition-colors ${activeTab === 'saved' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <BookmarkIcon className="w-3 h-3" /> Saved
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="py-8">
          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {currentPosts.map((post, index) => (
                <div
                  key={post._id}
                  onClick={() => openPostModal(post, index)}
                  className="relative aspect-square cursor-pointer group bg-gray-100"
                >
                  {post.media?.url ? (
                    <Image src={post.media.url} alt={post.content || "Post image"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                      No Media
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 text-white font-semibold transition-opacity">
                    <div className="flex items-center gap-1">{post.likes?.length || 0}</div>
                    <div className="flex items-center gap-1">{post.comments?.length || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 border-2 rounded-full flex items-center justify-center border-gray-300">
                {activeTab === 'posts' ? <Grid className="w-8 h-8 text-gray-400" /> : <BookmarkIcon className="w-8 h-8 text-gray-400" />}
              </div>
              <h3 className="text-xl font-light mb-2">{activeTab === 'posts' ? 'No Posts Yet' : 'No Saved Posts'}</h3>
            </div>
          )}
        </div>

        {/* Post Modal */}
        {selectedPost && (
          <ProfileModal
            post={selectedPost}
            isLiked={isLiked}
            isSaved={isSaved}
            closeModal={closePostModal}
            navigatePost={navigatePost}
            handleLike={handleLike}
            handleSave={handleSave}
            currentIndex={currentPostIndex}
            totalPosts={currentPosts.length}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
}
