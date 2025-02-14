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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentAuthMiddleware = exports.teacherAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const teacherAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Access token missing" });
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        return res.status(500).json({
            success: false,
            message: "Access token secret not configured",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        if (!decoded.teacherId) {
            res.status(401).json({ success: false, message: "Invalid token payload" });
            return;
        }
        req.id = decoded.teacherId;
        next();
    }
    catch (error) {
        console.error("Error in teacherAuthMiddleware:", error);
        res
            .status(401)
            .json({ success: false, message: "Invalid or expired token" });
    }
});
exports.teacherAuthMiddleware = teacherAuthMiddleware;
const studentAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Access token missing" });
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        return res.status(500).json({
            success: false,
            message: "Access token secret not configured",
        });
    }
    try {
        // Verify token and extract payload for student
        const decoded = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        if (!decoded.studentId) {
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }
        req.id = decoded.studentId;
        next();
    }
    catch (error) {
        console.error("Error in studentAuthMiddleware:", error);
        res
            .status(401)
            .json({ success: false, message: "Invalid or expired token" });
    }
});
exports.studentAuthMiddleware = studentAuthMiddleware;
