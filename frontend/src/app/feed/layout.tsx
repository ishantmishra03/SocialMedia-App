"use client";

import { ReactNode, useState, useEffect } from "react";
import { useColorMode } from "@/contexts/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import { 
  Moon, 
  Sun, 
  Home, 
  Search, 
  MessageCircle, 
  User, 
  LogOut,
  Plus,
  Heart,
  Bookmark,
  Settings,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/hooks";
import axios from "@/lib/axios";
import { logout } from "@/store/slices/auth.slice";

export default function FeedLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toggleColorMode, isDarkMode } = useColorMode();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
      try {
        const {data} = await axios.post('/api/auth/logout');
        if(data.success){
          dispatch(logout());
          toast.success(data.message);
          router.replace("/auth/login");
        }
      } catch (error: any) {
        const message = error.response?.data?.error || "Google login failed";
        toast.error(message);
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
    { icon: User, label: "Profile", href: "/feed", isActive: pathname === "/profile" },
    { icon: Bookmark, label: "Saved", href: "/feed", isActive: pathname === "/saved" },
    { icon: TrendingUp, label: "Analytics", href: "/feed", isActive: pathname === "/analytics" },
    { icon: Settings, label: "Settings", href: "/feed", isActive: pathname === "/settings" },
  ];

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? "bg-black text-white" 
        : "bg-white text-gray-900"
    }`}>
      
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-full w-[245px] flex-col z-50 transition-all duration-300 border-r ${
        isDarkMode 
          ? "bg-black border-gray-800" 
          : "bg-white border-gray-200"
      }`}>
        
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
                  item.isActive 
                    ? "scale-105" 
                    : "group-hover:scale-105"
                }`}
                strokeWidth={item.isActive ? 2.5 : 1.5}
              />
              <span className="text-base font-normal">{item.label}</span>
              
              {/* Active indicator */}
              {item.isActive && (
                <div className={`absolute right-2 w-1 h-6 rounded-full ${
                  isDarkMode ? "bg-white" : "bg-gray-900"
                }`}></div>
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
              <LogOut 
                size={20} 
                className="mr-4 transition-transform duration-200 group-hover:scale-105"
              />
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

      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 backdrop-blur-xl border-b ${
        isDarkMode 
          ? "bg-black/80 border-gray-800" 
          : "bg-white/80 border-gray-200"
      }`}>
        <Link href="/feed" className="flex items-center space-x-2">
          <div className={`w-7 h-7 rounded-lg ${
            isDarkMode ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gradient-to-br from-purple-500 to-blue-500"
          } flex items-center justify-center`}>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">MySocial</span>
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

      {/* Main Content */}
      <main className="lg:ml-[245px] min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around backdrop-blur-xl border-t ${
        isDarkMode 
          ? "bg-black/90 border-gray-800" 
          : "bg-white/90 border-gray-200"
      }`}>
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
              fill={item.isActive && item.icon === Home ? "currentColor" : "none"}
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
          <User 
            size={24} 
            strokeWidth={pathname === "/profile" ? 2.5 : 1.5}
          />
        </Link>
      </nav>

      
      <div 
        className={`fixed inset-0 pointer-events-none -z-10 ${
          isDarkMode ? "opacity-[0.015]" : "opacity-[0.008]"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${isDarkMode ? '%23ffffff' : '%23000000'}' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}