"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoute_1 = __importDefault(require("../src/routers/authRoute"));
const PostRouter_1 = __importDefault(require("./routers/PostRouter"));
const userRouter_1 = __importDefault(require("../src/routers/userRouter"));
const StoryRouter_1 = __importDefault(require("./routers/StoryRouter"));
const FollowRouter_1 = __importDefault(require("./routers/FollowRouter"));
const LikeRouter_1 = __importDefault(require("./routers/LikeRouter"));
const CommentRouter_1 = __importDefault(require("./routers/CommentRouter"));
const ConvertRouter_1 = __importDefault(require("./routers/ConvertRouter"));
const SuggestedRouter_1 = __importDefault(require("./routers/SuggestedRouter"));
const chatRoute_1 = __importDefault(require("./routers/chatRoute"));
const messageModel_1 = __importDefault(require("./models/messageModel"));
const roomModel_1 = __importDefault(require("./models/roomModel"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const checkMsg_1 = __importDefault(require("./utils/auth/checkMsg"));
const SaveRouter_1 = __importDefault(require("./routers/SaveRouter"));
const notification_1 = __importDefault(require("./models/notification"));
const userModel_1 = require("./models/userModel");
const notification_2 = __importDefault(require("./routers/notification"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 9000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
}));
const server = http_1.default.createServer(app);
const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
if (!mongoConnectionString) {
    throw new Error("MONGO_CONNECTION_STRING is not defined in the environment variables");
}
mongoose_1.default.connect(mongoConnectionString).then(() => {
    console.log("Database connected");
});
// Routers
app.use("/api/auth", authRoute_1.default);
app.use("/api", PostRouter_1.default);
app.use("/api/users", userRouter_1.default);
app.use("/api", FollowRouter_1.default);
app.use("/api", LikeRouter_1.default);
app.use("/api", CommentRouter_1.default);
app.use("/api", ConvertRouter_1.default);
app.use("/api", StoryRouter_1.default);
app.use("/api", SaveRouter_1.default);
app.use("/api", SuggestedRouter_1.default);
app.use("/api/chat", chatRoute_1.default);
app.use("/api/notifications", notification_2.default);
// Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://newwinstagram.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
let roomUsers = {};
const users = new Map();
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("join-room", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId, currentId } = data;
        const isParticipant = yield (0, checkMsg_1.default)(roomId, currentId);
        if (isParticipant) {
            if (!roomUsers[roomId]) {
                roomUsers[roomId] = [];
            }
            roomUsers[roomId].push(socket.id);
            socket.join(roomId);
            console.log(`User ${currentId} joined room ${roomId}`);
            const messages = yield messageModel_1.default.find({ room: roomId })
                .sort({ createdAt: 1 })
                .populate("sender", "username avatarImage");
            socket.emit("previousMessages", messages);
        }
        else {
            console.log(`User ${currentId} is not a participant in room ${roomId}`);
        }
    }));
    socket.on("serverMSG", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, senderId, content }) {
        const isInRoom = [...socket.rooms].includes(roomId);
        if (!isInRoom) {
            return socket.emit("error", {
                message: "You must join the room before sending messages.",
            });
        }
        const newMessage = yield new messageModel_1.default({
            room: roomId,
            sender: senderId,
            content,
        }).save();
        const populatedMessage = yield newMessage.populate("sender", "username avatarImage");
        io.to(roomId).emit("fromServer", populatedMessage);
        yield roomModel_1.default.findByIdAndUpdate(roomId, {
            lastMessage: populatedMessage._id,
        });
    }));
    socket.on("typing", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, userId, isTyping }) {
        const user = yield userModel_1.User.findById(userId).select("username avatarImage");
        if (user) {
            socket.to(roomId).emit("displayTyping", {
                userId,
                username: user.username,
                avatarImage: user.avatarImage,
                isTyping,
            });
        }
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const roomId in roomUsers) {
            const userIndex = roomUsers[roomId].indexOf(socket.id);
            if (userIndex !== -1) {
                roomUsers[roomId].splice(userIndex, 1);
                console.log(`User ${socket.id} disconnected from room ${roomId}`);
                if (roomUsers[roomId].length === 0) {
                    console.log(`Room ${roomId} is now empty`);
                    const lastMessage = yield messageModel_1.default.findOne({ room: roomId }).sort({
                        createdAt: -1,
                    });
                    if (lastMessage) {
                        yield roomModel_1.default.findByIdAndUpdate(roomId, {
                            lastMessage: lastMessage.content,
                        });
                        console.log(`Room ${roomId} updated with last message: "${lastMessage.content}"`);
                    }
                }
                break;
            }
        }
    }));
    socket.on("join-user", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined personal room`);
    });
    socket.on("addUser", (userId) => {
        users.set(userId, socket.id); // холбоод хадгална
    });
    socket.on("sendNotification", (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId, type }) {
        try {
            const senderUser = yield userModel_1.User.findById(senderId);
            if (!senderUser)
                return console.error("Sender user not found");
            const username = senderUser.username;
            const receiverSocketId = users.get(receiverId);
            // -------------------- FOLLOW --------------------
            if (type === "follow") {
                const newNotification = new notification_1.default({
                    senderId,
                    receiverId,
                    type,
                    message: `${username} followed you.`,
                });
                yield newNotification.save();
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
                yield notification_1.default.deleteMany({
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
                const newNotification = new notification_1.default({
                    senderId,
                    receiverId,
                    type,
                    message: `${username} liked your post.`,
                });
                yield newNotification.save();
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
                yield notification_1.default.deleteMany({
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
                const newNotification = new notification_1.default({
                    senderId,
                    receiverId,
                    type,
                    message: `${username} commented on your post.`,
                });
                yield newNotification.save();
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("getNotification", {
                        senderId,
                        username,
                        type,
                    });
                }
            }
        }
        catch (error) {
            console.error("❌ Notification хадгалахад эсвэл устгахад алдаа:", error);
        }
    }));
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
server.listen(port, () => {
    console.log(`Server and Socket.IO listening on http://localhost:${port}`);
});
