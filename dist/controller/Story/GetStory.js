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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMyStories = exports.getStories = void 0;
const storyModel_1 = require("../../models/storyModel");
const userModel_1 = require("../../models/userModel");
// GET /api/story/:userId
const getStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: "userId шаардлагатай" });
            return;
        }
        // Хэрэглэгч болон дагалдагчдыг олох
        const user = yield userModel_1.User.findById(userId).populate("following");
        if (!user || !user.following) {
            res
                .status(404)
                .json({ error: "Хэрэглэгч олдсонгүй эсвэл дагалдагчгүй байна" });
            return;
        }
        const allowedUserIds = [user._id, ...user.following.map((f) => f._id)];
        const now = new Date();
        // Story-нуудыг авах (userId болон expiresAt шалгуураар)
        const stories = yield storyModel_1.Story.find({
            userId: { $in: allowedUserIds },
            expiresAt: { $gt: now },
        })
            .sort({ createdAt: -1 })
            .populate("userId", "username avatarImage");
        // Story-нуудыг хэрэглэгчээр бүлэглэх
        const groupedStories = {};
        for (const story of stories) {
            const userKey = story.userId._id.toString();
            if (!groupedStories[userKey]) {
                groupedStories[userKey] = {
                    user: story.userId,
                    stories: [],
                };
            }
            groupedStories[userKey].stories.push(story);
        }
        // Объектийг массив болгон хөрвүүлэх
        const result = Object.values(groupedStories);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({
            error: "Story татаж чадсангүй",
            message: err.message,
        });
    }
});
exports.getStories = getStories;
const getAllMyStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: "userId шаардлагатай" });
            return;
        }
        const stories = yield storyModel_1.Story.find({ userId }) // зөвхөн тухайн хэрэглэгчийн stories
            .sort({ createdAt: -1 })
            .populate("userId", "username avatarImage");
        res.status(200).json(stories);
    }
    catch (err) {
        res.status(500).json({
            error: "Өөрийн бүх stories-г татаж чадсангүй",
            message: err.message,
        });
    }
});
exports.getAllMyStories = getAllMyStories;
