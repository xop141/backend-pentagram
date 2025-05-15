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
exports.hasUserViewedStories = void 0;
const storyModel_1 = require("../../models/storyModel");
const hasUserViewedStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyIds, userId } = req.body;
        if (!Array.isArray(storyIds) || !userId) {
            res
                .status(400)
                .json({ error: "storyIds (array) болон userId шаардлагатай." });
            return;
        }
        // Бүх story-г авчирч, тухайн хэрэглэгч үзсэн үү гэдгийг шалгана
        const stories = yield storyModel_1.Story.find({ _id: { $in: storyIds } });
        const viewedStoryIds = stories
            .filter((story) => story.viewers.includes(userId))
            .map((story) => story.id.toString());
        res.status(200).json({ viewedStoryIds }); // ['id1', 'id2']
    }
    catch (err) {
        res.status(500).json({
            error: "Үзсэн эсэхийг шалгах үед алдаа гарлаа",
            message: err.message,
        });
    }
});
exports.hasUserViewedStories = hasUserViewedStories;
