import { Server, Socket } from "socket.io";

interface NotificationSocketProps {
  io: Server;
}

export const initializeNotificationSocket = ({ io }: NotificationSocketProps) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal notification room`);
    });

    socket.on("leave", (userId: string) => {
      socket.leave(userId);
      console.log(`User ${userId} left their room`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
