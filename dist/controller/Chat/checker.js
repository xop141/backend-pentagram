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
const roomModel_1 = __importDefault(require("../../models/roomModel"));
const checker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectedUsers } = req.body;
        if (!Array.isArray(selectedUsers) || selectedUsers.length === 0) {
            res.status(400).json({ message: "Invalid selectedUsers array" });
            return;
        }
        console.log("Selected Users:", selectedUsers);
        const validUsers = selectedUsers.filter(user => user && user.name && user.id);
        if (validUsers.length < 2) {
            res.status(400).json({ message: "At least two valid users are required" });
            return;
        }
        const userNames = validUsers.map((user) => user.name);
        console.log("User Names:", userNames);
        const existingRoom = yield roomModel_1.default.findOne({
            participants: { $all: validUsers.map((user) => user.id) },
        });
        if (existingRoom) {
            res.status(200).json({ roomExists: true, roomId: existingRoom._id });
            return;
        }
        const newRoom = yield roomModel_1.default.create({
            participants: validUsers.map((user) => user.id),
            name: userNames.join(", "),
        });
        res.status(201).json({
            message: "Room created successfully",
            roomId: newRoom._id,
        });
    }
    catch (error) {
        console.error("Error in createRoom:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = checker;
