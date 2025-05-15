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
exports.getSuggestedFollowers = void 0;
const userModel_1 = require("../../models/userModel");
const mongoose_1 = __importDefault(require("mongoose"));
const getSuggestedFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserId = req.params.id;
        if (!currentUserId) {
            res.status(400).json({ message: "User ID required" });
            return;
        }
        const currentUser = yield userModel_1.User.findById(currentUserId).select("following");
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const followingIds = currentUser.following.map((id) => id.toString());
        const friends = yield userModel_1.User.find({ _id: { $in: followingIds } }).select("following");
        const friendsOfFriendsSet = new Set();
        for (const friend of friends) {
            (_a = friend.following) === null || _a === void 0 ? void 0 : _a.forEach((id) => {
                const stringId = id.toString();
                if (stringId !== currentUserId && !followingIds.includes(stringId)) {
                    friendsOfFriendsSet.add(stringId);
                }
            });
        }
        let suggestionIds = Array.from(friendsOfFriendsSet);
        let suggestedUsers;
        if (suggestionIds.length > 0) {
            suggestedUsers = yield userModel_1.User.find({ _id: { $in: suggestionIds } })
                .select("_id username fullname avatarImage")
                .limit(10);
        }
        // Хэрвээ санал болгох хэрэглэгч олдоогүй бол random-аар санал болгох
        if (!suggestedUsers || suggestedUsers.length === 0) {
            suggestedUsers = yield userModel_1.User.aggregate([
                {
                    $match: {
                        _id: {
                            $nin: [
                                ...followingIds.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                                new mongoose_1.default.Types.ObjectId(currentUserId),
                            ],
                        },
                    },
                },
                { $sample: { size: 20 } }, // Random-аар 10 хэрэглэгч
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        fullname: 1,
                        avatarImage: 1,
                    },
                },
            ]);
        }
        res.status(200).json(suggestedUsers);
    }
    catch (error) {
        console.error("Suggested followers error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getSuggestedFollowers = getSuggestedFollowers;
