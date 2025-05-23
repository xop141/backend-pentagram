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
const notification_1 = __importDefault(require("../models/notification"));
const router = express_1.default.Router();
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_1.default.find({
            receiverId: req.params.userId,
        })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json(notifications);
    }
    catch (err) {
        console.error("Notification fetch error:", err);
        res.status(500).json({ message: "Мэдэгдэл уншихад алдаа гарлаа" });
    }
}));
exports.default = router;
