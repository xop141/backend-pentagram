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
exports.addStoryViewer = void 0;
const storyModel_1 = require("../../models/storyModel");
const addStoryViewer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyId, userId } = req.body; // ✅ энэ мөрийг өөрчил
        if (!storyId || !userId) {
            res.status(400).json({ error: "Story ID and User ID are required" });
            return;
        }
        const story = yield storyModel_1.Story.findById(storyId);
        if (!story) {
            res.status(404).json({ error: "Story not found" });
            return;
        }
        if (!story.viewers.includes(userId)) {
            story.viewers.push(userId);
            yield story.save();
        }
        res.status(200).json({ hasViewed: true });
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to add viewer",
            message: err.message,
        });
    }
});
exports.addStoryViewer = addStoryViewer;
