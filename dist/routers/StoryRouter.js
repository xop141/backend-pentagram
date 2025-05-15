"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GetStory_1 = require("../controller/Story/GetStory");
const CreateStory_1 = require("../controller/Story/CreateStory");
const Update_1 = require("../controller/Story/Update");
const DeleteStory_1 = require("../controller/Story/DeleteStory");
const PostViewStory_1 = require("../controller/Story/PostViewStory");
const GetViewStory_1 = require("../controller/Story/GetViewStory");
const router = express_1.default.Router();
router.get("/Getstory/:userId", GetStory_1.getStories);
router.get("/story/all/:userId", GetStory_1.getAllMyStories); // ✅ энэ мөрийг нэм
router.post("/story/:userId", CreateStory_1.createStory);
router.put("/story/:id", Update_1.updateStory);
router.delete("/story/:id", DeleteStory_1.deleteStory);
router.post("/storyHasView", GetViewStory_1.hasUserViewedStories);
router.post("/ViewStory", PostViewStory_1.addStoryViewer);
exports.default = router;
