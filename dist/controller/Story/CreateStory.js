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
exports.createStory = void 0;
const storyModel_1 = require("../../models/storyModel");
const createStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        const { caption, expiresIn, imageUrl } = req.body;
        if (!imageUrl) {
            res.status(400).json({ error: "Image is required" });
            return;
        }
        const expiresInMs = expiresIn ? parseInt(expiresIn) : 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + expiresInMs);
        const story = new storyModel_1.Story({
            userId,
            imageUrl,
            caption,
            expiresAt,
            viewers: [],
        });
        yield story.save();
        res.status(201).json(story);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to create story",
            message: err.message,
        });
    }
});
exports.createStory = createStory;
