"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupCreateSchema = exports.teacherLoginSchema = exports.teacherSignupSchema = void 0;
const zod_1 = require("zod");
exports.teacherSignupSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" })
        .regex(/^[A-Za-z\s.'-]+$/, {
        message: "Name can only contain letters, spaces, periods, apostrophes, and hyphens",
    }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    phone: zod_1.z.string().regex(/^\d{10}$/, {
        message: "Phone number must be exactly 10 digits",
    }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" }),
});
exports.teacherLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" }),
});
exports.groupCreateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Group name is required" })
        .max(100, { message: "Group name must be less than 100 characters" }),
    description: zod_1.z
        .string()
        .min(1, { message: "Group description is required" })
        .max(500, { message: "Group description must be less than 500 characters" }),
    groupCode: zod_1.z
        .string()
        .min(1, { message: "Group code is required" })
        .max(50, { message: "Group code must be less than 50 characters" }),
});
//# sourceMappingURL=zodSchema.js.map