import { NextFunction, Response } from "express";
import { AuthRequest } from "../controllers/userController";
import asyncHandler from "./asyncHandler";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({message:"Not authorized, no token provided"});
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    return res.status(404).json({message:"User not found, invalid token"});
  }

  req.user = user;
  next();
});