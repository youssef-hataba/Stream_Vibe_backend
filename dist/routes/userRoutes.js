"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.get('/profile', userController_1.getUserProfile);
router.post("/favorites", userController_1.addToFavorites);
router.delete("/favorites/:movieId", userController_1.removeFromFavorites);
router.post("/watchlater", userController_1.addToWatchLater);
router.delete("/watchlater/:movieId", userController_1.removeFromWatchLater);
router.post("/upload-profilePic", upload_1.default.single("image"), userController_1.uploadProfilePicture);
exports.default = router;
