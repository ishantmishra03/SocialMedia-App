"use client";

import { useColorMode } from "@/contexts/ThemeContext";
import Link from "next/link";
import {
  Home,
  Search,
  MessageCircle,
  User,
  LogOut,
  Plus,
  Heart,
  Bookmark,
  Settings,
  TrendingUp,
  Moon,
  Sun,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import { toast } from "react-toastify";
import axios from "@/lib/axios";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toggleColorMode, isDarkMode } = useColorMode();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        dispatch(logout());
        toast.success(data.message);
        router.replace("/auth/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Logout failed");
    }
  };

  const mainNavItems = [
    { icon: Home, label: "Home", href: "/feed", isActive: pathname === "/feed" },
    { icon: Search, label: "Explore", href: "/explore", isActive: pathname === "/explore" },
    { icon: Plus, label: "Create", href: "/create", isActive: pathname === "/create" },
    { icon: Heart, label: "Activity", href: "/feed", isActive: pathname === "/activity" },
    { icon: MessageCircle, label: "Messages", href: "/feed", isActive: pathname === "/messages" },
  ];

  const secondaryNavItems = [
    { icon: User, label: "Profile", href: "/profile", isActive: pathname === "/profile" },
    { icon: Bookmark, label: "Saved", href: "/feed", isActive: pathname === "/saved" },
    { icon: TrendingUp, label: "Analytics", href: "/feed", isActive: pathname === "/analytics" },
    { icon: Settings, label: "Settings", href: "/feed", isActive: pathname === "/settings" },
  ];

  return (
    <aside className={`hidden lg:flex fixed left-0 top-0 h-full w-[245px] flex-col z-50 transition-all duration-300 border-r ${
      isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
    }`}>
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-800">
        <Link href="/feed" className="flex items-center space-x-3 group">
          <div className={`relative w-8 h-8 rounded-lg overflow-hidden ${
            isDarkMode ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gradient-to-br from-purple-500 to-blue-500"
          } shadow-lg`}>
            <div className="absolute inset-1 bg-white rounded-sm opacity-90"></div>
            <div className={`absolute inset-2 rounded-sm ${
              isDarkMode ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gradient-to-br from-purple-500 to-blue-500"
            }`}></div>
          </div>
          <span className="text-2xl font-bold tracking-tight">SocialMedia</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 relative ${
              item.isActive
                ? isDarkMode
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-900 font-medium"
                : isDarkMode
                ? "text-gray-300 hover:bg-gray-900 hover:text-white"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon
              size={24}
              className={`mr-4 transition-all duration-200 ${
                item.isActive ? "scale-105" : "group-hover:scale-105"
              }`}
              strokeWidth={item.isActive ? 2.5 : 1.5}
            />
            <span className="text-base font-normal">{item.label}</span>
            {item.isActive && (
              <div className={`absolute right-2 w-1 h-6 rounded-full ${isDarkMode ? "bg-white" : "bg-gray-900"}`}></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                item.isActive
                  ? isDarkMode
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900 font-medium"
                  : isDarkMode
                  ? "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <item.icon
                size={20}
                className="mr-4 transition-transform duration-200 group-hover:scale-105"
                strokeWidth={item.isActive ? 2 : 1.5}
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className={`w-full group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                : "text-red-600 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            <LogOut size={20} className="mr-4 transition-transform duration-200 group-hover:scale-105" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="px-3 pb-6">
        <button
          onClick={toggleColorMode}
          className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
            isDarkMode
              ? "bg-gray-900 hover:bg-gray-800 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {isDarkMode ? <Sun size={20} className="mr-4" /> : <Moon size={20} className="mr-4" />}
          <span className="text-sm">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </aside>
  );
}
