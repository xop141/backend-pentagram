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
const userModel_1 = require("../../models/userModel");
const PostModel_1 = __importDefault(require("../../models/PostModel"));
// Like хийх функц
function likePost(userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            // ID-ийн форматыг шалгах
            if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
                !mongoose_1.default.Types.ObjectId.isValid(postId)) {
                throw new Error("Буруу ID формат");
            }
            // string-г ObjectId болгон хөрвүүлэх
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const postObjectId = new mongoose_1.default.Types.ObjectId(postId);
            // Хэрэглэгч болон постыг хайх
            const [user, post] = yield Promise.all([
                userModel_1.User.findById(userObjectId),
                PostModel_1.default.findById(postObjectId),
            ]);
            if (!user || !post) {
                throw new Error("Хэрэглэгч эсвэл пост олдсонгүй");
            }
            if ((_a = post.likes) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId)) {
                return {
                    message: "Та энэ постыг аль хэдийн like хийсэн байна",
                    likes: post.likes,
                };
            }
            // Постын likes жагсаалтад хэрэглэгчийн ID-г нэмэх
            post.likes = (_b = post.likes) !== null && _b !== void 0 ? _b : [];
            post.likes.push(userObjectId);
            yield Promise.all([post.save()]);
            return {
                message: `${user.username} successfully liked the post`,
                likes: post.likes,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Алдаа: ${error.message}`);
            }
            throw new Error("Алдаа: Тодорхойгүй алдаа гарлаа");
        }
    });
}
exports.default = likePost;
