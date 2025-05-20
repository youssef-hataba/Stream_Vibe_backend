import express from "express";
import { addToFavorites, addToWatchLater, getUserProfile, removeFromFavorites, removeFromWatchLater } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);
router.get('/profile', getUserProfile);

router.post("/favorites", addToFavorites);
router.delete("/favorites/:movieId", removeFromFavorites);

router.post("/watchlater", addToWatchLater);
router.delete("/watchlater/:movieId", removeFromWatchLater);


export default router;