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
const UserByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.params.name;
    try {
        const data = yield userModel_1.User.find({
            username: { $regex: search, $options: 'i' }
        })
            .select('username avatarImage _id');
        if (data.length === 0) {
            res.status(404).json({ message: 'No users found' });
            return;
        }
        res.status(200).json(data.slice(0, 5));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.default = UserByName;
