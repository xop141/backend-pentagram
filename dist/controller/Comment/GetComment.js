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
exports.getComments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PostModel_1 = __importDefault(require("../../models/PostModel"));
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
        res.status(400).json({ message: "Invalid post ID" });
        return;
    }
    try {
        const post = yield PostModel_1.default.findById(postId).populate({
            path: "comments.userId",
            select: "username avatar",
        });
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // Map to return username and comment cleanly (optional)
        const comments = post.comments.map((c) => {
            var _a, _b, _c;
            return ({
                _id: c._id,
                comment: c.comment,
                createdAt: c.createdAt,
                user: {
                    _id: (_a = c.userId) === null || _a === void 0 ? void 0 : _a._id,
                    username: (_b = c.userId) === null || _b === void 0 ? void 0 : _b.username,
                    avatar: (_c = c.userId) === null || _c === void 0 ? void 0 : _c.avatar,
                },
            });
        });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getComments = getComments;
