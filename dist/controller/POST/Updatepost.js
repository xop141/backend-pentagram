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
const PostModel_1 = __importDefault(require("../../models/PostModel"));
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { userId, comment, caption } = req.body;
        if (!postId || !userId) {
            res
                .status(400)
                .json({ message: "Post ID and User ID are required." });
        }
        const updateFields = {
            $push: {
                comments: {
                    userId,
                    comment,
                    createdAt: new Date(),
                },
            },
        };
        if (caption) {
            updateFields.caption = caption;
        }
        const updatedPost = yield PostModel_1.default.findByIdAndUpdate(postId, updateFields, {
            new: true,
            runValidators: true,
        });
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found." });
        }
        res.status(200).json({
            message: "Comment added successfully.",
            post: updatedPost,
        });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.default = addComment;
