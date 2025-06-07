import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/UserModel";
import Review from "../models/ReviewModel";

export interface AuthRequest extends Request {
  user?: any;
};

export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id).select("-password -__v");
  if (!user) {
    return res.status(404).json({
      message: "user not found"
    })
  }

  const reviews = await Review.find({ user: user._id }).select("-__v");

  res.status(200).json({
    status: "success",
    user,
    reviews
  });
});

export const addToFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { movieId, title, thumbnail, IMDB_Rating } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (!movieId || !title || !thumbnail) {
    return res.status(400).json({ message: "movieId, title and thumbnail are required" });
  }

  const exists = user.favorites.some((item) => item.movieId.toString() === movieId);
  if (exists) return res.status(400).json({ message: "Already in favorites" });

  user.favorites.push({ movieId, title, thumbnail, IMDB_Rating });
  await user.save();

  res.status(200).json({ status: "success", favorites: user.favorites });
});


export const removeFromFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { movieId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.favorites = user.favorites.filter((item) => item.movieId.toString() !== movieId);
  await user.save();

  res.status(200).json({ status: "success", favorites: user.favorites });
});


export const addToWatchLater = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { movieId, title, thumbnail, IMDB_Rating } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  const exists = user.watchLater.some((item) => item.movieId.toString() === movieId);
  if (exists) return res.status(400).json({ message: "Already in watch later" });

  user.watchLater.push({ movieId, title, thumbnail, IMDB_Rating });
  await user.save();

  res.status(200).json({ status: "success", watchLater: user.watchLater });
});


export const removeFromWatchLater = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { movieId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.watchLater = user.watchLater.filter((item) => item.movieId.toString() !== movieId);
  await user.save();

  res.status(200).json({ status: "success", watchLater: user.watchLater });
});

