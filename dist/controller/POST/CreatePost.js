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
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption, imageUrl, userId } = req.body;
        if (!userId || !imageUrl) {
            res.status(400).json({ message: "User ID and Image URL are required." });
        }
        const newPost = new PostModel_1.default({
            userId,
            caption,
            imageUrl,
            likes: [],
            shares: 0,
            comments: [],
            createdAt: new Date(),
        });
        const savedPost = yield newPost.save();
        res
            .status(201)
            .json({ message: "Post created successfully.", post: savedPost });
    }
    catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.default = createPost;
