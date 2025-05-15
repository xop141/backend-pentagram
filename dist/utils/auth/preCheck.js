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
const mailSender_1 = __importDefault(require("./mailSender"));
const preUser_1 = require("../../models/preUser");
const preCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, fullname, password, email } = req.body;
        if (!username || !fullname || !password || !email) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const existingUsername = yield userModel_1.User.findOne({ username });
        if (existingUsername) {
            res.status(400).json({ message: "Username already exists" });
            return;
        }
        const existingEmail = yield userModel_1.User.findOne({ email });
        if (existingEmail) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        yield (0, mailSender_1.default)(email, code);
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const pre = new preUser_1.PreUser({
            username,
            fullname,
            email,
            password: hashedPassword,
            code: code.toString(),
        });
        yield pre.save();
        res.status(200).json({ message: "Verification code sent to email", code: pre._id });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.default = preCheck;
