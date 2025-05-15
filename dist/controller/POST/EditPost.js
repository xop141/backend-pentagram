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
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { caption, imageUrl } = req.body;
        const post = yield PostModel_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found." });
            return;
        }
        if (caption !== undefined)
            post.caption = caption;
        if (imageUrl !== undefined)
            post.imageUrl = imageUrl;
        const updatedPost = yield post.save();
        res.status(200).json({
            message: "Post updated successfully.",
            post: updatedPost,
        });
    }
    catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.default = editPost;
