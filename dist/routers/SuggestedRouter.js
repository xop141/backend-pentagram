"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Suggested_1 = require("../controller/Suggested/Suggested");
const userRouter = express_1.default.Router();
userRouter.get("/Suggested/:id", Suggested_1.getSuggestedFollowers);
exports.default = userRouter;
