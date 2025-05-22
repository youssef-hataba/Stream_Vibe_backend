import mongoose, { Schema, Document, Model } from "mongoose";

interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId;
  movieId: number;
  rating: number;
  review?: string;
  createdAt: Date;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0.5, max: 5 },
    review: { type: String, trim: true }
  },
  {
    timestamps: true
  }
);

const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
