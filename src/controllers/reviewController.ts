import { Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthRequest } from "./userController";
import User from "../models/UserModel";
import Review from "../models/ReviewModel";


export const addReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { movieId, rating, review } = req.body;
  const user = await User.findById(req.user.id).select("-password -__v");
  if (!user) {
    return res.status(404).json({
      message: "user not found"
    })
  }

  const existingReview = await Review.findOne({ user: user._id, movieId })
  if (existingReview) {
    rating ? existingReview.rating = rating : null;
    review ? existingReview.review = review : null;
    await existingReview.save();
    return res.status(200).json({ message: "Review updated", review: existingReview });
  }

  const newReview = await Review.create({
    user: user._id,
    movieId,
    rating,
    review
  })

  res.status(201).json({
    status: "success",
    review: newReview
  })
});


export const getReviewsByMovie = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { movieId } = req.params;
  const reviews = await Review.find({ movieId }).populate("user", "firstName lastName profilePic");

  const formattedReviews = reviews.map((review) => {
    const user = review.user as any;
    return {
      id: review.id.toString(),
      author: {
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        avatar_path: user.profilePic || null,
        rating:review.rating  
      },
      content: review.review || "",
      created_at: review.createdAt,
      source:"users"
    };
  });

  res.status(200).json({
    id: movieId,
    results: formattedReviews,
    total_results: formattedReviews.length,
  });
});