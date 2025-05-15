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
const userModel_1 = require("../../models/userModel"); // Assuming you have a User model
const getGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.roomId;
    try {
        // Find the room by ID and select only participants field
        const room = yield roomModel_1.default.findById(roomId).select("participants");
        if (!room) {
            res.status(404).send({ message: "Room not found" });
            return;
        }
        // Get the participants' details (username and avatarImage) based on their userIds
        const participants = yield userModel_1.User.find({
            _id: { $in: room.participants }, // Find users whose _id is in the participants array
        }).select("username avatarImage"); // Corrected field names
        // Map the participants to include username and avatarImage
        const participantsWithDetails = participants.map(user => ({
            _id: user._id,
            username: user.username, // Corrected field name
            avatarImage: user.avatarImage, // Corrected field name
        }));
        res.status(200).json({ participants: participantsWithDetails });
    }
    catch (error) {
        console.error("Error fetching group participants:", error);
        res.status(500).send("Server error");
    }
});
exports.default = getGroup;
