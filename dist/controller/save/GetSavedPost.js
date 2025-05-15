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
exports.getSavedPosts = void 0;
const userModel_1 = require("../../models/userModel");
const getSavedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userModel_1.User.findById(userId)
            .populate("savedPosts") // энэ populate нь зөв ажиллах ёстой
            .exec(); // optional, гэвч зарим тохиолдолд хэрэгтэй байдаг
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ savedPosts: user.savedPosts });
        return;
    }
    catch (error) {
        console.error("Error fetching saved posts:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.getSavedPosts = getSavedPosts;
