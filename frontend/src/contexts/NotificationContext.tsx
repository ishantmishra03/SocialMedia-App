"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotifications, Notification } from "@/hooks/useNotification";
import { useAppSelector } from "@/store/hooks";
import { markAllNotificationsRead } from "@/lib/api/notification";

interface NotificationContextType {
  notifications: Notification[];
  unreadNotifications: number;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationMode = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotificationMode must be used within NotificationContextProvider");
  return context;
};

export const NotificationContextProvider = ({ children }: { children: React.ReactNode }) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const { notifications, setNotifications } = useNotifications(userId);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    setUnreadNotifications(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadNotifications(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadNotifications, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
