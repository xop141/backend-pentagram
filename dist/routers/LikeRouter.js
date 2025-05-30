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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Like_1 = __importDefault(require("../controller/Like/Like"));
const Unlike_1 = __importDefault(require("../controller/Like/Unlike"));
const CheckLike_1 = __importDefault(require("../controller/Like/CheckLike"));
const LikeRouter = express_1.default.Router();
// Like хийх
LikeRouter.post("/like", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body;
    try {
        const result = yield (0, Like_1.default)(userId, postId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
        });
    }
}));
// Unlike хийх
LikeRouter.post("/unlike", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body;
    try {
        const result = yield (0, Unlike_1.default)(userId, postId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
        });
    }
}));
LikeRouter.get("/check-like", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.query;
    try {
        const result = yield (0, CheckLike_1.default)(userId, postId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Тодорхойгүй алдаа гарлаа",
        });
    }
}));
exports.default = LikeRouter;
