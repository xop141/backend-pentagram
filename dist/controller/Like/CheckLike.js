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
const mongoose_1 = __importDefault(require("mongoose"));
const PostModel_1 = __importDefault(require("../../models/PostModel"));
function checkLike(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
                !mongoose_1.default.Types.ObjectId.isValid(postId)) {
                throw new Error("ID формат буруу байна");
            }
            const post = yield PostModel_1.default.findById(postId);
            if (!post) {
                throw new Error("Пост олдсонгүй");
            }
            const liked = (_a = post.likes) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId.toString());
            return { liked: liked !== null && liked !== void 0 ? liked : false };
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Тодорхойгүй алдаа");
        }
    });
}
exports.default = checkLike;
