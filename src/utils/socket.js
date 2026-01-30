const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (user1, user2) => {
  return crypto
    .createHash("sha256")
    .update([user1, user2].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // -------------------------------
    // JOIN CHAT
    // -------------------------------
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log("User joined room:", roomId);
    });

    // -------------------------------
    // SEND MESSAGE
    // -------------------------------
    socket.on(
      "sendMessage",
      async ({ senderId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(senderId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [senderId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [senderId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId, // ✅ FIXED
            text,
          });

          await chat.save();

          // send message to both users in room
          io.to(roomId).emit("messageReceived", {
            senderId,
            text,
          });
        } catch (err) {
          console.log("Chat save error:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      // optional
    });
  });
};

module.exports = initializeSocket;
