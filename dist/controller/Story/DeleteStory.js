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
exports.deleteStory = void 0;
const storyModel_1 = require("../../models/storyModel");
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const story = yield storyModel_1.Story.findById(id);
        if (!story) {
            res.status(404).json({ error: "Story not found" });
            return;
        }
        // Optional: Cloudinary-оос зургийг устгах бол
        // const publicId = story.imageUrl.split('/').pop()?.split('.')[0];
        // if (publicId) await cloudinary.uploader.destroy(`folder/${publicId}`);
        yield storyModel_1.Story.findByIdAndDelete(id);
        res.status(200).json({ message: "Story deleted successfully" });
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to delete story",
            message: err.message,
        });
    }
});
exports.deleteStory = deleteStory;
