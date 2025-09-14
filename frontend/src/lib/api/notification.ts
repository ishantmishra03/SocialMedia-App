import axios from "@/lib/axios";

export const fetchNotifications = async () => {
  const res = await axios.get("/api/notifications");
  return res.data.data;
};

export const markNotificationRead = async (id: string) => {
  const res = await axios.patch(`/api/notifications/${id}/read`);
  return res.data.data;
};

export const markAllNotificationsRead = async () => {
  const res = await axios.patch("/api/notifications/read-all");
  return res.data;
};
