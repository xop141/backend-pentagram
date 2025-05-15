"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SavePost_1 = require("../controller/save/SavePost");
const GetSavedPost_1 = require("../controller/save/GetSavedPost");
const UnsavePost_1 = require("../controller/save/UnsavePost");
const savedRouter = express_1.default.Router();
savedRouter.post("/savePost/:userId", SavePost_1.savePost);
savedRouter.get("/getSavePost/:userId", GetSavedPost_1.getSavedPosts);
savedRouter.post("/unsavePost/:postId", UnsavePost_1.unsavePost);
exports.default = savedRouter;
