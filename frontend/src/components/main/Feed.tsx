"use client";

import { useEffect, useState } from "react";
import { useColorMode } from "@/contexts/ThemeContext";
import axios from "@/lib/axios";
import PostCard from "./Post/PostCard";
import { IPost } from "@/types/index";
import {  
  RefreshCw,   
} from "lucide-react";
import Story from "./Story";
import PostLoading from "./Post/PostLoading";
import PostError from "./Post/PostError";
import PostEmpty from "./Post/PostEmpty";

export default function Feed() {
  const { isDarkMode } = useColorMode();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const { data } = await axios.get("/api/posts");
      if (data.success) {
        setPosts(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch posts");
      }
    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to load posts";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = () => {
    fetchPosts(true);
  };

  // Loading State
  if (loading) {
    return <PostLoading />;
  }

  // Error State
  if (error && posts.length === 0) {
    return <PostError error={error} handleRefresh={handleRefresh}/>;
  }

  // Empty State
  if (posts.length === 0) {
    return <PostEmpty handleRefresh={handleRefresh} refreshing={refreshing}/>;
  }

  // Main Feed
  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories Section */}
      <Story />

      {/* Feed Header with Refresh */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Latest Posts
        </h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-2 rounded-lg transition-colors ${
            refreshing ? "animate-spin" : ""
          } ${
            isDarkMode
              ? "hover:bg-gray-900 text-gray-400 hover:text-white disabled:text-gray-600"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900 disabled:text-gray-400"
          }`}
          title="Refresh feed"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post._id.toString()} post={post} />
        ))}
      </div>

    </div>
  );
}