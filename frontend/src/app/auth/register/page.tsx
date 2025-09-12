"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UploadCloud, Sparkles } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "@/lib/axios";
import { useColorMode } from "@/contexts/ThemeContext";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";

export default function RegisterPage() {
  const { isDarkMode } = useColorMode();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarFileName(file.name);
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const { username, email, password } = form;

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { data } = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Registration successful!");
        router.push("/auth/login");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
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
        router.push("/");
      } else {
        toast.error(data.error || "Google login failed");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Google Login Failed";
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

   // Redirect if already login
  
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    console.log(isAuthenticated);
  
    useEffect(() => {
      if (isAuthenticated) {
        router.replace("/"); 
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
          Create Your Account <Sparkles />
        </h1>
      </div>

      <div className="mt-6 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google login error")}
        />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
            }`}
            placeholder="yourusername"
            disabled={loading}
          />
        </div>

        <div>
          <label className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
            }`}
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-900 border-gray-300"
              }`}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePassword}
              className={`absolute inset-y-0 right-0 flex items-center px-3 ${
                isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"
              }`}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className={`block mb-1 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Avatar
          </label>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
              }`}
            >
              <UploadCloud size={20} />
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className={`block w-full text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }
                file:mr-4 file:py-1 file:px-3
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100`}
                disabled={loading}
              />
              {avatarFileName && (
                <p className={`text-xs mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Selected: {avatarFileName}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 mt-4 rounded-lg font-semibold transition-all ${
            loading ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className={`text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
