"use client";

import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "@/lib/axios";
import { useColorMode } from "@/contexts/ThemeContext";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/auth.slice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useColorMode();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        dispatch(setUser(data.user));
        toast.success("Login successful!");
        router.push("/feed");
      }
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const { credential } = credentialResponse;
      if (!credential) return;

      const { data } = await axios.post("/api/auth/login/google", {
        credential,
      });

      if (data.success) {
        toast.success("Google login successful!");
        router.push("/feed");
      } else {
        toast.error(data.error || "Google login failed");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Google login failed";
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };


  // Redirect if already login

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed"); 
    }
  }, [isAuthenticated, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-3xl font-bold flex items-center gap-3 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Welcome Back <Sparkles />
        </h1>
        <p
          className={`mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Login to your account to explore.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google login error")}
        />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className={`block mb-1 text-sm font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Email
          </label>
          <input
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? "bg-gray-800 text-gray-100 border-gray-700"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            className={`block mb-1 text-sm font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-100 border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none ${
                isDarkMode
                  ? "text-gray-300 hover:text-blue-400"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link href="#" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 mt-4 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        className={`text-center text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Don’t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
