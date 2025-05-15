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
exports.createComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PostModel_1 = __importDefault(require("../../models/PostModel"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { userId, comment } = req.body;
    const post = yield PostModel_1.default.findById(postId);
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
    }
    if (!comment) {
        res.status(400).json({ message: "Comment is required." });
        return;
    }
    try {
        const post = yield PostModel_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const newComment = {
            userId: new mongoose_1.default.Types.ObjectId(userId),
            comment,
            createdAt: new Date(),
        };
        post.comments.push(newComment);
        yield post.save();
        res.status(200).json({ message: "Comment added", comment: newComment });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.createComment = createComment;
exports.default = exports.createComment;
