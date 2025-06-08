import express from "express";
import { addToFavorites, addToWatchLater, getUserProfile, removeFromFavorites, removeFromWatchLater, uploadProfilePicture } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/upload";

const router = express.Router();

router.use(protect);
router.get('/profile', getUserProfile);

router.post("/favorites", addToFavorites);
router.delete("/favorites/:movieId", removeFromFavorites);

router.post("/watchlater", addToWatchLater);
router.delete("/watchlater/:movieId", removeFromWatchLater);


router.post("/upload-profilePic", upload.single("image"), uploadProfilePicture);

export default router;