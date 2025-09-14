"use client";

import { ReactNode, useState, useEffect } from "react";
import { useColorMode } from "@/contexts/ThemeContext";

import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Moon, Sun } from "lucide-react";

export default function FeedLayout({ children }: { children: ReactNode }) {
  const { toggleColorMode, isDarkMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Desktop Sidebar */}
      <Sidebar />
      <MobileNav />

      {/* Desktop Theme Toggle */}
      <button
        onClick={toggleColorMode}
        className={`hidden lg:flex fixed top-4 right-4 items-center px-3 py-2.5 rounded-lg transition-all duration-200 z-50 ${
          isDarkMode
            ? "bg-gray-900 hover:bg-gray-800 text-gray-300"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        {isDarkMode ? (
          <Sun size={20} className="mr-2" />
        ) : (
          <Moon size={20} className="mr-2" />
        )}
        <span className="text-sm">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
      </button>

      {/* Main Content */}
      <main className="lg:ml-[245px] min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>

      <div
        className={`fixed inset-0 pointer-events-none -z-10 ${
          isDarkMode ? "opacity-[0.015]" : "opacity-[0.008]"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${
            isDarkMode ? "%23ffffff" : "%23000000"
          }' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
