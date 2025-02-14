"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const groupController_1 = require("@/controllers/groupController");
const authMiddleware_1 = require("@/middleware/authMiddleware");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/create', authMiddleware_1.teacherAuthMiddleware, groupController_1.createGroup);
exports.default = router;
