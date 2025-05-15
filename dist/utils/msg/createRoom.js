"use strict";
// import { Request, Response } from 'express';
// import room from '../../models/roomModel'
// const createRoom =async (req: Request, res: Response) => {
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
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const newRoom = new roomModel_1.default({
        name: data[0].name,
        participants: data.map((user) => ({
            _id: user.id,
            username: user.name,
        })),
    });
    try {
        const savedRoom = yield newRoom.save();
        res.status(201).json({
            message: 'Room created successfully',
            roomId: savedRoom._id,
        });
    }
    catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Error creating room', error });
    }
});
exports.default = createRoom;
