"use client";

import { useEffect } from "react";
import { useNotificationMode } from "@/contexts/NotificationContext";
import Image from "next/image";

export default function NotificationsPage() {
  const { notifications, markAllRead } = useNotificationMode();

  useEffect(() => {
    if (notifications.length > 0) {
      markAllRead();
    }
  }, [notifications, markAllRead]);

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-10">
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                ${n.isRead ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900"}
              `}
            >
              {n.from?.avatar && (
                <Image
                  src={n.from.avatar}
                  alt={n.from.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}

              <div className="flex-1 flex items-center justify-between gap-2">
                <p className="text-sm">
                  <span className="font-semibold">{n.from?.username}</span>{" "}
                  {n.type === "like" && "liked your post"}
                  {n.type === "comment" && "commented on your post"}
                  {n.type === "follow" && "started following you"}
                  {n.type === "message" && "sent you a message"}
                  {n.type === "mention" && "mentioned you in a post"}
                </p>

                {n.post?.media?.url && (
                  <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={n.post.media.url}
                      alt="Post"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
