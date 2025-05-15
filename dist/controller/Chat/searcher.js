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
const roomModel_1 = __importDefault(require("../../models/roomModel"));
const userModel_1 = require("../../models/userModel");
const searcher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.roomId;
        const { username } = req.body;
        // Validate input
        if (!username || typeof username !== "string") {
            res.status(400).json({ message: "Invalid or missing username" });
            return;
        }
        // Find the room and select participants
        const room = yield roomModel_1.default.findById(roomId).select("participants");
        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return;
        }
        // Convert participant ObjectIds to strings
        const existingUserIds = room.participants.map((id) => id.toString());
        // Find users that start with the input username and are not in the room
        const users = yield userModel_1.User.find({
            username: { $regex: `^${username}`, $options: "i" }, // starts with, case-insensitive
            _id: { $nin: existingUserIds },
        })
            .select("_id username")
            .limit(10); // optional: limit results
        res.status(200).json(users);
    }
    catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.default = searcher;
