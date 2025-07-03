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
exports.getReviewsByMovie = exports.addReview = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const ReviewModel_1 = __importDefault(require("../models/ReviewModel"));
exports.addReview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId, rating, review } = req.body;
    const user = yield UserModel_1.default.findById(req.user.id).select("-password -__v");
    if (!user) {
        return res.status(404).json({
            message: "user not found"
        });
    }
    const existingReview = yield ReviewModel_1.default.findOne({ user: user._id, movieId });
    if (existingReview) {
        rating ? existingReview.rating = rating : null;
        review ? existingReview.review = review : null;
        yield existingReview.save();
        return res.status(200).json({ message: "Review updated", review: existingReview });
    }
    const newReview = yield ReviewModel_1.default.create({
        user: user._id,
        movieId,
        rating,
        review
    });
    res.status(201).json({
        status: "success",
        review: newReview
    });
}));
exports.getReviewsByMovie = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const reviews = yield ReviewModel_1.default.find({ movieId }).populate("user", "firstName lastName profilePic");
    const formattedReviews = reviews.map((review) => {
        const user = review.user;
        return {
            id: review.id.toString(),
            author: {
                name: user.fullName || `${user.firstName} ${user.lastName}`,
                avatar_path: user.profilePic || null,
                rating: review.rating
            },
            content: review.review || "",
            created_at: review.createdAt,
            source: "users"
        };
    });
    res.status(200).json({
        id: movieId,
        results: formattedReviews,
        total_results: formattedReviews.length,
    });
}));
