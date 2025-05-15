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
// Unfollow хийх функц
function unfollowUser(followerId, followingId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            // ID-ийн форматыг шалгах
            if (!mongoose_1.default.Types.ObjectId.isValid(followerId) ||
                !mongoose_1.default.Types.ObjectId.isValid(followingId)) {
                throw new Error("Буруу ID формат");
            }
            // string-г ObjectId болгон хөрвүүлэх
            const followerObjectId = new mongoose_1.default.Types.ObjectId(followerId);
            const followingObjectId = new mongoose_1.default.Types.ObjectId(followingId);
            // Хэрэглэгч өөрийгөө unfollow хийхийг оролдож байгаа эсэхийг шалгах
            if (followerObjectId.equals(followingObjectId)) {
                throw new Error("Та өөрийгөө unfollow хийх боломжгүй");
            }
            // Хэрэглэгчдийг хайх
            const [follower, following] = yield Promise.all([
                userModel_1.User.findById(followerObjectId),
                userModel_1.User.findById(followingObjectId),
            ]);
            if (!follower || !following) {
                throw new Error("Хэрэглэгч олдсонгүй");
            }
            // Follow хийгээгүй бол шалгах
            if (!((_a = follower.following) === null || _a === void 0 ? void 0 : _a.includes(followingObjectId))) {
                throw new Error("Та энэ хэрэглэгчийг follow хийгээгүй байна");
            }
            // Follower-ийн following жагсаалтаас хасах
            follower.following = (_b = follower.following) !== null && _b !== void 0 ? _b : [];
            follower.following = follower.following.filter((id) => !id.equals(followingObjectId));
            // Following-ийн followers жагсаалтаас хасах
            following.followers = (_c = following.followers) !== null && _c !== void 0 ? _c : [];
            following.followers = following.followers.filter((id) => !id.equals(followerObjectId));
            // Хоёр хэрэглэгчийн өөрчлөлтийг хадгалах
            yield Promise.all([follower.save(), following.save()]);
            return {
                message: `${follower.username} successfully unfollowed ${following.username}`,
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
exports.default = unfollowUser;
