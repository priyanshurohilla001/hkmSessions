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
exports.teacherCreateGroup = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const zodSchema_1 = require("../zodSchema");
const teacherCreateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = zodSchema_1.groupCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(422).json({
            success: false,
            message: "Invalid request body.",
            errors: parseResult.error.errors,
        });
    }
    const { name, description, groupCode } = parseResult.data;
    const teacherId = req.body.id;
    try {
        const group = yield prisma_1.default.group.create({
            data: {
                name,
                description,
                groupCode,
                teacherId
            },
        });
        return res.status(201).json({
            success: true,
            message: "Group created successfully.",
            group,
        });
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "The provided group code is already in use.",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
exports.teacherCreateGroup = teacherCreateGroup;
