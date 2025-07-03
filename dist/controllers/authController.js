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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Send JWT in Cookie
const sendToken = (res, user, statusCode) => {
    const _a = user.toObject(), { password } = _a, safeUser = __rest(_a, ["password"]);
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    };
    res
        .status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
        message: statusCode === 200 ? "Login successful" : "User registered successfully",
        user: safeUser,
    });
};
// ✅ Register User
exports.register = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = yield UserModel_1.default.findOne({ email });
    if (existingUser)
        return res.status(400).json({ message: "User already exists" });
    const newUser = yield UserModel_1.default.create({
        firstName,
        lastName,
        email,
        password,
    });
    sendToken(res, newUser, 201);
}));
// ✅ Login User
exports.login = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Please provide email and password");
    }
    const user = yield UserModel_1.default.findOne({ email });
    if (!user || !(yield user.comparePassword(password, user.password))) {
        return res.status(401).json("Invalid email or password");
    }
    if (!user.isActive) {
        user.isActive = true;
        yield user.save({ validateBeforeSave: false });
    }
    sendToken(res, user, 200);
}));
// ✅ Logout User (optional)
exports.logout = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
}));
