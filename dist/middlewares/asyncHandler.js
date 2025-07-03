"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => {
    return (req, res, next) => {
        //If the function resolves successfully, it proceeds normally. If an error occurs, `.catch(next)` automatically forwards the error to the next middleware (which is usually the global error handler).
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
