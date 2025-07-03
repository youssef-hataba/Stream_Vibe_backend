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
exports.uploadProfilePicture = exports.removeFromWatchLater = exports.addToWatchLater = exports.removeFromFavorites = exports.addToFavorites = exports.getUserProfile = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const ReviewModel_1 = __importDefault(require("../models/ReviewModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
;
exports.getUserProfile = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel_1.default.findById(req.user.id).select("-password -__v");
    if (!user) {
        return res.status(404).json({
            message: "user not found"
        });
    }
    const reviews = yield ReviewModel_1.default.find({ user: user._id }).select("-__v");
    res.status(200).json({
        status: "success",
        user,
        reviews
    });
}));
exports.addToFavorites = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId, title, thumbnail, IMDB_Rating } = req.body;
    const user = yield UserModel_1.default.findById(req.user.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (!movieId || !title || !thumbnail) {
        return res.status(400).json({ message: "movieId, title and thumbnail are required" });
    }
    const exists = user.favorites.some((item) => item.movieId.toString() === movieId);
    if (exists)
        return res.status(400).json({ message: "Already in favorites" });
    user.favorites.push({ movieId, title, thumbnail, IMDB_Rating });
    yield user.save();
    res.status(200).json({ status: "success", favorites: user.favorites });
}));
exports.removeFromFavorites = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const user = yield UserModel_1.default.findById(req.user.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    user.favorites = user.favorites.filter((item) => item.movieId.toString() !== movieId);
    yield user.save();
    res.status(200).json({ status: "success", favorites: user.favorites });
}));
exports.addToWatchLater = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId, title, thumbnail, IMDB_Rating } = req.body;
    const user = yield UserModel_1.default.findById(req.user.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const exists = user.watchLater.some((item) => item.movieId.toString() === movieId);
    if (exists)
        return res.status(400).json({ message: "Already in watch later" });
    user.watchLater.push({ movieId, title, thumbnail, IMDB_Rating });
    yield user.save();
    res.status(200).json({ status: "success", watchLater: user.watchLater });
}));
exports.removeFromWatchLater = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const user = yield UserModel_1.default.findById(req.user.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    user.watchLater = user.watchLater.filter((item) => item.movieId.toString() !== movieId);
    yield user.save();
    res.status(200).json({ status: "success", watchLater: user.watchLater });
}));
exports.uploadProfilePicture = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const user = yield UserModel_1.default.findById(userId);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    if (!req.file)
        return res.status(400).json({ message: 'No image uploaded' });
    const uploadResult = yield cloudinary_1.default.uploader.upload_stream({ folder: 'profile_images' }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error)
            return res.status(500).json({ message: 'Cloudinary upload failed', error });
        user.profilePic = result === null || result === void 0 ? void 0 : result.secure_url;
        yield user.save();
        return res.status(200).json({ message: 'Image uploaded', imageUrl: user.profilePic });
    }));
    uploadResult.end(req.file.buffer);
}));
