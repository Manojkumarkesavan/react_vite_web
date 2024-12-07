// index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

const PORT = 3000;
const SPRING_BOOT_URL = "http://localhost:8088";

app.use(cors());
app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: "*", // Update this with your client origin in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle joining a conversation room
  socket.on("join", ({ conversationId }) => {
    if (conversationId) {
      const roomId = String(conversationId);
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    } else {
      console.error("No conversationId provided to join event");
    }
  });

  // Handle sending a message
  socket.on("send-message", async (message) => {
    try {
      const conversationId = message.conversation?.id;
      if (!conversationId) {
        socket.emit("error", { message: "Invalid conversation ID" });
        return;
      }

      const roomId = String(conversationId);

      // Broadcast the message to others in the room (excluding the sender)
      socket.broadcast.to(roomId).emit("receive-message", {
        ...message,
        status: "DELIVERED", // Set status to DELIVERED for recipient
      });

      // Prepare data for the backend
      const messageDTO = {
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        conversationId: conversationId,
        status: "SENT",
      };

      // Save the message to the backend
      const response = await axios.post(
        `${SPRING_BOOT_URL}/api/messages`,
        messageDTO,
      );

      const savedMessage = response.data;

      // Acknowledge the sender with the saved message (including ID and status)
      socket.emit("message-sent", {
        tempId: message.tempId, // temporary ID used on client-side
        message: savedMessage,
      });

      console.log("Message saved:", savedMessage);
    } catch (error) {
      console.error("Error in send-message handler:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle message delivered acknowledgment
  socket.on("message-delivered", async (data) => {
    const { messageId, conversationId } = data;
    const roomId = String(conversationId);

    try {
      // Update the message status in the backend
      await axios.put(
        `${SPRING_BOOT_URL}/api/messages/${messageId}/status`,
        '"DELIVERED"',
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      // Broadcast the status update to the sender
      socket.broadcast.to(roomId).emit("message-status-updated", {
        messageId,
        status: "DELIVERED",
      });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  });

  // Handle message read acknowledgment
  socket.on("message-read", async (data) => {
    const { messageId, conversationId } = data;
    const roomId = String(conversationId);

    try {
      // Update the message status in the backend
      await axios.put(
        `${SPRING_BOOT_URL}/api/messages/${messageId}/status`,
        '"READ"',
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      // Broadcast the status update to the sender
      socket.broadcast.to(roomId).emit("message-status-updated", {
        messageId,
        status: "READ",
      });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
