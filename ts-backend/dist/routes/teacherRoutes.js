"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherController_1 = require("../controllers/teacherController");
const router = (0, express_1.Router)();
router.post('/signup', teacherController_1.teacherSignUpController);
router.post('/login', teacherController_1.teacherLoginController);
exports.default = router;
