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
exports.teacherLoginController = exports.teacherSignUpController = void 0;
const zodSchema_1 = require("../zodSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const teacherSignUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate input with trimmed data (via zod preprocess)
    const parseResult = zodSchema_1.teacherSignupSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(422).json({ success: false, errors: parseResult.error.errors });
    }
    const { name, email, password, phone } = parseResult.data;
    // Ensure token secrets exist
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        return res.status(500).json({ success: false, message: "Token secrets are not configured." });
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    try {
        // Hash the password before storing
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Use a transaction to ensure atomicity (if any step fails, nothing is committed)
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create the teacher record
            const teacher = yield tx.teacher.create({
                data: { name, email, password: hashedPassword, phone },
            });
            // Generate tokens
            const accessToken = jsonwebtoken_1.default.sign({ teacherId: teacher.id }, accessTokenSecret, { expiresIn: "1h" });
            const refreshToken = jsonwebtoken_1.default.sign({ teacherId: teacher.id }, refreshTokenSecret, { expiresIn: "30d" });
            // Update the teacher with the refresh token
            const updatedTeacher = yield tx.teacher.update({
                where: { id: teacher.id },
                data: { refreshToken },
            });
            // Remove sensitive data before sending response
            updatedTeacher.password = "";
            return { teacher: updatedTeacher, tokens: { accessToken, refreshToken } };
        }));
        return res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher: result.teacher,
            tokens: result.tokens,
        });
    }
    catch (error) {
        console.error("Error during teacher signup:", error);
        // Handle duplicate email error (Prisma error code P2002)
        if (error.code === "P2002") {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.teacherSignUpController = teacherSignUpController;
const teacherLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = zodSchema_1.teacherLoginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(422).json({ success: false, errors: parseResult.error.errors });
    }
    const { email, password } = parseResult.data;
    try {
        const teacher = yield prisma_1.default.teacher.findUnique({ where: { email } });
        if (!teacher) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).json({ success: false, message: "Token secret is not configured." });
        }
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const accessToken = jsonwebtoken_1.default.sign({ teacherId: teacher.id }, accessTokenSecret, { expiresIn: "1h" });
        teacher.password = "";
        return res.status(200).json({
            success: true,
            message: "Login successful",
            teacher,
            tokens: { accessToken, refreshToken: teacher.refreshToken },
        });
    }
    catch (error) {
        console.error("Error during teacher login:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.teacherLoginController = teacherLoginController;
