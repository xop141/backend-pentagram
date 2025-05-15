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
exports.getPostById = exports.getPostsByUser = void 0;
const PostModel_1 = __importDefault(require("../../models/PostModel"));
const userModel_1 = require("../../models/userModel");
const getPostsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const user = yield userModel_1.User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
            return;
        }
        const posts = yield PostModel_1.default.find({ userId: user._id });
        res.status(200).json({ posts });
    }
    catch (error) {
        console.error("Error fetching posts by user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getPostsByUser = getPostsByUser;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("Requested ID:", id);
    try {
        const post = yield PostModel_1.default.findById(id).populate("userId", "username avatarImage");
        if (!post) {
            console.log("Post not found with ID:", id);
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error("Error fetching post by ID", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getPostById = getPostById;
