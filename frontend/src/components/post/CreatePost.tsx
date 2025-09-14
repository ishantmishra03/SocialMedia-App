"use client";

import { useState, useRef } from "react";
import { X, Image as Image1,  Send } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import Image from "next/image";

interface CreatePostProps {
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function CreatePost({ onClose, onPostCreated }: CreatePostProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (!content && !media) {
      toast.info("Please add some text or select a media file.");
      return;
    }
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setMedia(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!content && !media) {
      toast.info("Cannot create empty post!");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (media) formData.append("media", media);

      const { data } = await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.info("Post created successfully!");
        onPostCreated?.();
        onClose();
      }
    } catch (err: any) {
      toast.info(err?.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-[90%] max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Add content/media */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              rows={4}
            />

            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Image1 className="w-5 h-5" /> Add Media
              </button>
              {media && <span className="text-sm truncate">{media.name}</span>}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
              />
            </div>

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Confirm and post */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-700 dark:text-gray-200">Preview your post:</p>
            <div className="border p-3 rounded-md dark:border-gray-700 dark:bg-gray-800">
              {content && <p className="mb-2">{content}</p>}
              {media && (
                <div className="mt-2">
                  {media.type.startsWith("image") ? (
                    <Image
                      src={URL.createObjectURL(media)}
                      alt="preview"
                      className="max-h-60 w-full object-contain rounded-md"
                      width={400}
                      height={400}
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(media)}
                      controls
                      className="max-h-60 w-full rounded-md"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 border rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Posting..." : <><Send className="w-4 h-4 inline-block mr-1" /> Post</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
