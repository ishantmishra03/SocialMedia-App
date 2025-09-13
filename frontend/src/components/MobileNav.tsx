"use client";

import Link from "next/link";
import { useColorMode } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sun,
  Home,
  Search,
  MessageCircle,
  User,
  Plus,
  Heart,
} from "lucide-react";

export default function MobileNav() {
  const { toggleColorMode, isDarkMode } = useColorMode();
  const pathname = usePathname();

  const mainNavItems = [
    {
      icon: Home,
      label: "Home",
      href: "/feed",
      isActive: pathname === "/feed",
    },
    {
      icon: Search,
      label: "Explore",
      href: "/explore",
      isActive: pathname === "/explore",
    },
    {
      icon: Plus,
      label: "Create",
      href: "/create",
      isActive: pathname === "/create",
    },
    {
      icon: Heart,
      label: "Activity",
      href: "/feed",
      isActive: pathname === "/activity",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      href: "/feed",
      isActive: pathname === "/messages",
    },
  ];
  return (
    <div>
      {/* Mobile Header */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 backdrop-blur-xl border-b ${
          isDarkMode
            ? "bg-black/80 border-gray-800"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <Link href="/feed" className="flex items-center space-x-2">
          <div
            className={`w-7 h-7 rounded-lg ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-600 to-blue-600"
                : "bg-gradient-to-br from-purple-500 to-blue-500"
            } flex items-center justify-center`}
          >
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">SocialMedia</span>
        </Link>

        <button
          onClick={toggleColorMode}
          className={`p-2 rounded-full transition-all duration-200 ${
            isDarkMode
              ? "bg-gray-900 hover:bg-gray-800 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Mobile NAV  */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around backdrop-blur-xl border-t ${
          isDarkMode
            ? "bg-black/90 border-gray-800"
            : "bg-white/90 border-gray-200"
        }`}
      >
        {mainNavItems.slice(0, 4).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              item.isActive
                ? isDarkMode
                  ? "bg-white text-black"
                  : "bg-black text-white"
                : isDarkMode
                ? "text-gray-400 hover:text-white active:bg-gray-900"
                : "text-gray-600 hover:text-black active:bg-gray-100"
            }`}
          >
            <item.icon
              size={24}
              strokeWidth={item.isActive ? 2.5 : 1.5}
              fill={
                item.isActive && item.icon === Home ? "currentColor" : "none"
              }
            />
          </Link>
        ))}

        <Link
          href="/profile"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
            pathname === "/profile"
              ? isDarkMode
                ? "bg-white text-black"
                : "bg-black text-white"
              : isDarkMode
              ? "text-gray-400 hover:text-white active:bg-gray-900"
              : "text-gray-600 hover:text-black active:bg-gray-100"
          }`}
        >
          <User size={24} strokeWidth={pathname === "/profile" ? 2.5 : 1.5} />
        </Link>
      </nav>
    </div>
  );
}
