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
const userModel_1 = require("../../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password } = req.body;
    if (!login || !password) {
        res.status(400).json({ message: "Missing login or password" });
        return;
    }
    try {
        const user = yield userModel_1.User.findOne({
            $or: [{ email: login }, { username: login }, { phone: login }],
        });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(404).send("Invalid password");
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username, avatarImage: user.avatarImage, fullname: user.fullname }, process.env.JWT_SECRET, { expiresIn: "6h" });
        res.send(token);
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.default = loginAccount;
