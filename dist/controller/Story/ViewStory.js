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
exports.getStoryViewers = void 0;
const storyModel_1 = require("../../models/storyModel");
const getStoryViewers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storyId = req.params.storyId;
        const story = yield storyModel_1.Story.findById(storyId).populate("viewers", "username avatar email");
        if (!story) {
            res.status(404).json({ error: "Story not found" });
            return;
        }
        res.status(200).json({ viewers: story.viewers });
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to get viewers",
            message: err.message,
        });
    }
});
exports.getStoryViewers = getStoryViewers;
