"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CreateComment_1 = __importDefault(require("../controller/Comment/CreateComment"));
const GetComment_1 = require("../controller/Comment/GetComment");
const router = express_1.default.Router();
router.post("/posts/comment/:postId", CreateComment_1.default);
router.get("/posts/comment/:postId", GetComment_1.getComments);
exports.default = router;
