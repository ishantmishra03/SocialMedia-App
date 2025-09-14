"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "@/lib/api/notification";
import { getSocket } from "@/lib/socket";

export interface Notification {
  _id: string;
  type: "like" | "comment" | "follow" | "message" | "mention";
  isRead: boolean;
  createdAt: string;
  from?: { username: string; avatar: string };
  post?: { content: string; media?: { url: string } };
}

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    // fetch initial notifications 
    fetchNotifications()
      .then(setNotifications)
      .catch(console.error);

    // socket join
    const socket = getSocket();
    socket.emit("join", userId);

    // get new notification
    socket.on("new_notification", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    // remove notification 
    socket.on("remove_notification", (notifId: string) => {
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
    });

    return () => {
      socket.emit("leave", userId);
      socket.off("new_notification");
      socket.off("remove_notification");
    };
  }, [userId]);

  return { notifications, setNotifications };
};
