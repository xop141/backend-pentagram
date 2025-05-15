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
exports.searchUser = void 0;
const userModel_1 = require("../../models/userModel");
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query || typeof query !== "string") {
            res.status(400).json({ message: "Invalid search query" });
            return;
        }
        const users = yield userModel_1.User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { fullname: { $regex: query, $options: "i" } }, // name -> fullname
            ],
        }).select("username fullname avatarImage");
        if (users.length === 0) {
            res.status(404).json({ message: "Хэрэглэгч олдсонгүй" }); // Мессежийг нэгтгэх
            return;
        }
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchUser = searchUser;
