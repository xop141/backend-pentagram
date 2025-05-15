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
const mongoose_1 = __importDefault(require("mongoose"));
const checkMsg = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(roomId) || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return false;
        }
        const room = yield roomModel_1.default.findOne({
            _id: roomId,
            participants: new mongoose_1.default.Types.ObjectId(userId),
        });
        return !!room;
    }
    catch (err) {
        console.error('Error checking participant:', err);
        return false;
    }
});
exports.default = checkMsg;
