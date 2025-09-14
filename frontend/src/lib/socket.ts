import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return socket;
};
