import { NextFunction, Request, Response } from "express";
import User from "../models/UserModel";
import asyncHandler from "../middlewares/asyncHandler";
import jwt from 'jsonwebtoken';
// Send JWT in Cookie
const sendToken = (res: Response, user: any, statusCode: number) => {
  const { password, ...safeUser } = user.toObject();
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  } as any;

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      message: statusCode === 200 ? "Login successful" : "User registered successfully",
      user: safeUser,
    });
};

// ✅ Register User
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  sendToken(res, newUser, 201);
});

// ✅ Login User
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password, user.password))) {
    return res.status(401).json("Invalid email or password");
  }

  if (!user.isActive) {
    user.isActive = true;
    await user.save({ validateBeforeSave: false });
  }

  sendToken(res, user, 200);
});

// ✅ Logout User (optional)
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

