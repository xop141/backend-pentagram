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
exports.savePost = void 0;
const userModel_1 = require("../../models/userModel");
const mongoose_1 = __importDefault(require("mongoose"));
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const postId = req.body.postId;
        if (!postId || !mongoose_1.default.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ message: "Valid postId is required in headers" });
        }
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const postObjectId = new mongoose_1.default.Types.ObjectId(postId);
        if (user.savedPosts.includes(postObjectId)) {
            res.status(400).json({ message: "Post already saved" });
            return;
        }
        user.savedPosts.push(postObjectId);
        yield user.save();
        res.status(200).json({
            message: "Post saved successfully",
            savedPosts: user.savedPosts,
        });
    }
    catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.savePost = savePost;
