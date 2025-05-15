"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    participants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    lastMessage: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.models.Room || mongoose_1.default.model('Room', RoomSchema);
