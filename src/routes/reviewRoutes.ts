import express from "express";
import { addReview, getReviewsByMovie } from "../controllers/reviewController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:movieId", getReviewsByMovie);

export default router;
