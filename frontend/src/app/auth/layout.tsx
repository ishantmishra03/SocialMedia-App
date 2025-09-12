"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { useColorMode } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { toggleColorMode, isDarkMode } = useColorMode();


  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="hidden md:flex md:flex-1 lg:flex-[1.2] relative overflow-hidden">
        <Image
          src="/banner.jpg"
          alt="Professional workspace"
          fill
          className="object-cover brightness-75 contrast-110"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-blue-500/40" />

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
          <div className="max-w-md space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              Welcome to Our Platform
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of professionals who trust our secure and intuitive
              platform for exploring the social world.
            </p>
          </div>
        </div>

        <div className="absolute top-10 right-10 w-24 h-24 rounded-full border-2 border-white/20 before:content-[''] before:absolute before:top-5 before:left-5 before:w-14 before:h-14 before:rounded-full before:border before:border-white/30" />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-blue-300/40 rounded-full animate-float-delayed" />
      </div>

      <div className="flex-1 md:flex-1 lg:flex-[0.8] flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-0 relative">
        <div
          className={`absolute inset-0 pointer-events-none ${
            isDarkMode ? "opacity-[0.06]" : "opacity-[0.03]"
          }`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <button
          onClick={toggleColorMode}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full transition ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="w-full max-w-md relative z-10">
          <div
            className={`backdrop-blur-sm border rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/10 transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 ${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/90 border-gray-100"
            }`}
          >
            {children}
          </div>

          <div className="absolute top-[10%] right-[10%] w-2 h-2 bg-blue-500/30 rounded-full animate-float" />
          <div className="absolute bottom-[20%] left-[5%] w-1.5 h-1.5 bg-indigo-500/40 rounded-full animate-float-delayed-2" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-delayed-2 {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }

        .animate-float-delayed-2 {
          animation: float-delayed-2 4s ease-in-out infinite 2s;
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
