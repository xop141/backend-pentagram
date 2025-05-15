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
exports.getFeedPosts = void 0;
const PostModel_1 = __importDefault(require("../../models/PostModel"));
const userModel_1 = require("../../models/userModel");
const getFeedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        let posts;
        if (!user.following || user.following.length === 0) {
            posts = yield PostModel_1.default.find()
                .sort({ likes: -1 })
                .limit(5)
                .populate("userId", "username avatarImage")
                .populate("likes", "username avatarImage")
                .populate("comments.userId", "username avatarImage");
        }
        else {
            posts = yield PostModel_1.default.find({ userId: { $in: user.following } })
                .sort({ createdAt: -1 })
                .populate("userId", "username avatarImage")
                .populate("likes", "username avatarImage")
                .populate("comments.userId", "username avatarImage");
        }
        res.status(200).json(posts);
        return;
    }
    catch (err) {
        console.error("Error fetching feed posts:", err);
        res.status(500).json({ message: "Server error", error: err });
        return;
    }
});
exports.getFeedPosts = getFeedPosts;
