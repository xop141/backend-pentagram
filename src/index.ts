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
import notificationRoutes from "./routers/notification";

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
  })
);

const server = http.createServer(app);

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not defined in the environment variables"
  );
}

mongoose.connect(mongoConnectionString).then(() => {
  console.log("Database connected");
});
// Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

type RoomUsers = { [roomId: string]: string[] };
let roomUsers: RoomUsers = {};

const users = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", async (data) => {
    const { roomId, currentId } = data;
    const isParticipant = await checkMsg(roomId, currentId);

    if (isParticipant) {
      if (!roomUsers[roomId]) {
        roomUsers[roomId] = [];
      }
      roomUsers[roomId].push(socket.id);
      socket.join(roomId);
      console.log(`User ${currentId} joined room ${roomId}`);

      const messages = await Message.find({ room: roomId })
        .sort({ createdAt: 1 })
        .populate("sender", "username avatarImage");

      socket.emit("previousMessages", messages);
    } else {
      console.log(`User ${currentId} is not a participant in room ${roomId}`);
    }
  });

  socket.on("serverMSG", async ({ roomId, senderId, content }) => {
    const isInRoom = [...socket.rooms].includes(roomId);
    if (!isInRoom) {
      return socket.emit("error", {
        message: "You must join the room before sending messages.",
      });
    }

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
      lastMessage: populatedMessage._id,
    });
  });
  socket.on("typing", async ({ roomId, userId, isTyping }) => {
    const user = await User.findById(userId).select("username avatarImage");
  
    if (user) {
      socket.to(roomId).emit("displayTyping", {
        userId,
        username: user.username,
        avatarImage: user.avatarImage,
        isTyping,
      });
    }
  });

  socket.on("disconnect", async () => {
    for (const roomId in roomUsers) {
      const userIndex = roomUsers[roomId].indexOf(socket.id);
      if (userIndex !== -1) {
        roomUsers[roomId].splice(userIndex, 1);
        console.log(`User ${socket.id} disconnected from room ${roomId}`);

        if (roomUsers[roomId].length === 0) {
          console.log(`Room ${roomId} is now empty`);

          const lastMessage = await Message.findOne({ room: roomId }).sort({
            createdAt: -1,
          });

          if (lastMessage) {
            await roomModel.findByIdAndUpdate(roomId, {
              lastMessage: lastMessage.content,
            });

            console.log(
              `Room ${roomId} updated with last message: "${lastMessage.content}"`
            );
          }
        }
        break;
      }
    }
  });

 

  

 

});

server.listen(port, () => {
  console.log(`Server and Socket.IO listening on http://localhost:${port}`);
});
