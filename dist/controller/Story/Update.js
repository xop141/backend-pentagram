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
exports.updateStory = void 0;
const storyModel_1 = require("../../models/storyModel");
const updateStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { caption, expiresIn } = req.body;
        const story = yield storyModel_1.Story.findById(id);
        if (!story) {
            res.status(404).json({ error: "Story not found" });
            return;
        }
        if (caption)
            story.caption = caption;
        if (expiresIn) {
            story.expiresAt = new Date(Date.now() + parseInt(expiresIn));
        }
        yield story.save();
        res.status(200).json(story);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to update story",
            message: err.message,
        });
    }
});
exports.updateStory = updateStory;
