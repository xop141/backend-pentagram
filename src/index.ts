import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Message from "./models/messageModel";
import roomModel from "./models/roomModel";
import http from "http";
import { Server } from "socket.io";
import checkMsg from "./utils/auth/checkMsg";
import { User } from "./models/userModel";
import Notification from "./models/notification";


dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
}));

const server = http.createServer(app);

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) throw new Error("MONGO_CONNECTION_STRING is not defined in the environment variables");

mongoose.connect(mongoConnectionString).then(() => console.log("Database connected")).catch((err) => console.error("Database connection failed:", err));

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomUsers = new Map();

const users = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", async ({ roomId, currentId }) => {
    const isParticipant = await checkMsg(roomId, currentId);
    if (!isParticipant)
      return console.log(
        `User ${currentId} is not a participant in room ${roomId}`
      );

    if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set());

    const usersInRoom = roomUsers.get(roomId);
    if (!usersInRoom.has(socket.id)) {
      usersInRoom.add(socket.id);
      socket.join(roomId);
      console.log(`User ${currentId} joined room ${roomId}`);

      const messages = await Message.find({ room: roomId })
        .sort({ createdAt: 1 })
        .populate("sender", "username avatarImage");
      socket.emit("previousMessages", messages);
    }
  });

  socket.on("serverMSG", async ({ roomId, senderId, content }) => {
    if (![...socket.rooms].includes(roomId))
      return socket.emit("error", {
        message: "You must join the room before sending messages.",
      });

    const newMessage = await new Message({
      room: roomId,
      sender: senderId,
      content,
    }).save();
    const populatedMessage = await newMessage.populate(
      "sender",
      "username avatarImage"
    );

    io.to(roomId).emit("fromServer", populatedMessage);
    await roomModel.findByIdAndUpdate(roomId, {
      lastMessage: populatedMessage.content,
    });
  });

  socket.on("typing", async ({ roomId, userId, isTyping }) => {
    const user = await User.findById(userId).select("username avatarImage");
    if (user)
      socket
        .to(roomId)
        .emit("displayTyping", {
          userId,
          username: user.username,
          avatarImage: user.avatarImage,
          isTyping,
        });
  });

  socket.on("disconnect", () => {
    roomUsers.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
        if (users.size === 0) roomUsers.delete(roomId);
      }
    });
  });

 

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined personal room`);
  });

  socket.on("addUser", (userId) => {
    users.set(userId, socket.id); // холбоод хадгална
  });

  socket.on("sendNotification", async ({ senderId, receiverId, type }) => {

    console.log("📩 Notification ирлээ:", { senderId, receiverId, type });
    try {
      const senderUser = await User.findById(senderId);
      if (!senderUser) return console.error("Sender user not found");

      const username = senderUser.username;
      const receiverSocketId = users.get(receiverId);

      // -------------------- FOLLOW --------------------
      if (type === "follow") {
        const newNotification = new Notification({
          senderId,
          receiverId,
          type,
          message: `${username} followed you.`,
        });

        await newNotification.save();

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("getNotification", {
            senderId,
            username,
            type,
          });
        }
      }

      // -------------------- UNFOLLOW --------------------
      if (type === "unfollow") {
        await Notification.deleteMany({
          senderId,
          receiverId,
          type: "follow",
        });

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("deleteNotification", {
            senderId,
            type: "follow",
          });
        }
      }

      // -------------------- LIKE --------------------
      if (type === "like") {
        const newNotification = new Notification({
          senderId,
          receiverId,
          type,
          message: `${username} liked your post.`,
        });

        await newNotification.save();
        console.log("✅ Notification хадгалагдлаа");

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("getNotification", {
            senderId,
            username,
            type,
            message: newNotification.message,
          });
        }
      }

      // -------------------- UNLIKE --------------------
      if (type === "unlike") {
        await Notification.deleteMany({
          senderId,
          receiverId,
          type: "like",
        });

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("deleteNotification", {
            senderId,
            type: "like",
          });
        }
      }

      // -------------------- COMMENT --------------------
      if (type === "comment") {
        const newNotification = new Notification({
          senderId,
          receiverId,
          type,
          message: `${username} commented on your post.`,
        });

        await newNotification.save();

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("getNotification", {
            senderId,
            username,
            type,
          });
        }
      }
    } catch (error) {
      console.error("❌ Notification хадгалахад эсвэл устгахад алдаа:", error);
    }
  });
  socket.on("disconnect", () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log("🔴 Хэрэглэгч салсан:", userId);
        break;
      }
    }
  });
});

server.listen(port, () => console.log(`Server and Socket.IO listening on http://localhost:${port}`));
