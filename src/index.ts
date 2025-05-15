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

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

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

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", async ({ roomId, currentId }) => {
    const isParticipant = await checkMsg(roomId, currentId);
    if (!isParticipant) return console.log(`User ${currentId} is not a participant in room ${roomId}`);

    if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set());

    const usersInRoom = roomUsers.get(roomId);
    if (!usersInRoom.has(socket.id)) {
      usersInRoom.add(socket.id);
      socket.join(roomId);
      console.log(`User ${currentId} joined room ${roomId}`);

      const messages = await Message.find({ room: roomId }).sort({ createdAt: 1 }).populate("sender", "username avatarImage");
      socket.emit("previousMessages", messages);
    }
  });

  socket.on("serverMSG", async ({ roomId, senderId, content }) => {
    if (![...socket.rooms].includes(roomId)) return socket.emit("error", { message: "You must join the room before sending messages." });

    const newMessage = await new Message({ room: roomId, sender: senderId, content }).save();
    const populatedMessage = await newMessage.populate("sender", "username avatarImage");

    io.to(roomId).emit("fromServer", populatedMessage);
    await roomModel.findByIdAndUpdate(roomId, { lastMessage: populatedMessage._id });
  });

  socket.on("typing", async ({ roomId, userId, isTyping }) => {
    const user = await User.findById(userId).select("username avatarImage");
    if (user) socket.to(roomId).emit("displayTyping", { userId, username: user.username, avatarImage: user.avatarImage, isTyping });
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
});

server.listen(port, () => console.log(`Server and Socket.IO listening on http://localhost:${port}`));
