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
const userModel_1 = require("../../models/userModel");
const preUser_1 = require("../../models/preUser");
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, email } = req.body;
        if (!email || !code) {
            res.status(400).json({ message: "Email and code are required" });
            return;
        }
        const preUser = yield preUser_1.PreUser.findOne({ email });
        if (!preUser) {
            res.status(400).json({ message: "No pending verification found for this email" });
            return;
        }
        if (preUser.code !== code.toString()) {
            res.status(400).json({ message: "Invalid verification code" });
            return;
        }
        const newUser = yield userModel_1.User.create({
            username: preUser.username,
            fullname: preUser.fullname,
            password: preUser.password,
            email: preUser.email,
            avatarImage: "https://res.cloudinary.com/dvfl0oxmj/image/upload/v1746372697/gbbju93p0xiwunwz8hie.gif",
        });
        yield preUser_1.PreUser.deleteOne({ email });
        res.status(201).json({ message: "Account created successfully", user: newUser });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.default = createAccount;
