"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getGroup_1 = __importDefault(require("../controller/Chat/getGroup"));
const changeName_1 = __importDefault(require("../controller/Chat/changeName"));
const addMember_1 = __importDefault(require("../controller/Chat/addMember"));
const searcher_1 = __importDefault(require("../controller/Chat/searcher"));
const checker_1 = __importDefault(require("../controller/Chat/checker"));
const router = express_1.default.Router();
router.patch('/name/:roomId', changeName_1.default);
router.get('/get/:roomId', getGroup_1.default);
router.patch('/add/:roomId', addMember_1.default);
router.post('/users/:roomId', searcher_1.default);
router.post('/checkRoom', checker_1.default);
exports.default = router;
