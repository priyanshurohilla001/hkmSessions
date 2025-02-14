import { Router } from 'express';
import { teacherSignUpController, teacherLoginController } from '../controllers/teacherController.js';
import { teacherAuthMiddleware } from '@/middleware/authMiddleware.js';
import { teacherCreateGroup } from '@/controllers/teacherGroupController.js';

const router = Router();

router.post('/signup', teacherSignUpController);
router.post('/login', teacherLoginController);
router.post('/group/create',teacherAuthMiddleware , teacherCreateGroup )

export default router;
