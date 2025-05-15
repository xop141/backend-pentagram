"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const preUserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true,
    },
    code: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    avatarImage: {
        type: String,
    },
    followers: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
    isPrivate: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.PreUser = mongoose_1.default.model("PreUser", preUserSchema);
