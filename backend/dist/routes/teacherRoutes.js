"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherController_1 = require("@/controllers/teacherController");
const authMiddleware_1 = require("@/middleware/authMiddleware");
const teacherGroupController_1 = require("@/controllers/teacherGroupController");
const router = (0, express_1.Router)();
router.post('/signup', teacherController_1.teacherSignUpController);
router.post('/login', teacherController_1.teacherLoginController);
router.post('/group/create', authMiddleware_1.teacherAuthMiddleware, teacherGroupController_1.teacherCreateGroup);
exports.default = router;
//# sourceMappingURL=teacherRoutes.js.map