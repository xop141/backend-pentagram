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
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose to use ObjectId
const addMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.roomId;
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({ message: "userIds must be a non-empty array" });
            return;
        }
        // Validate if all userIds are valid ObjectIds
        const invalidUserIds = userIds.filter((id) => !mongoose_1.default.Types.ObjectId.isValid(id));
        if (invalidUserIds.length > 0) {
            res.status(400).json({ message: `Invalid user IDs: ${invalidUserIds.join(", ")}` });
            return;
        }
        const room = yield roomModel_1.default.findById(roomId);
        if (!room) {
            res.status(404).json({ message: "Room not found" });
            return;
        }
        // Explicitly typing 'id' as mongoose.Types.ObjectId to avoid TS7006 error
        const existingIds = room.participants.map((id) => id.toString());
        const newUserIds = userIds.filter((id) => !existingIds.includes(id));
        if (newUserIds.length === 0) {
            res.status(400).json({ message: "All users already in room" });
            return;
        }
        room.participants.push(...newUserIds);
        yield room.save();
        res.status(200).json({ message: "Users added to room", added: newUserIds });
        return;
    }
    catch (error) {
        console.error("Error adding users to room:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.default = addMember;
