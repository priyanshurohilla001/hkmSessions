import { Router } from 'express';
import { teacherSignUpController, teacherLoginController } from '@/controllers/teacherController';
import { teacherAuthMiddleware } from '@/middleware/authMiddleware';
import { teacherCreateGroup } from '@/controllers/teacherGroupController';

const router = Router();

router.post('/signup', teacherSignUpController);
router.post('/login', teacherLoginController);
router.post('/group/create',teacherAuthMiddleware , teacherCreateGroup )

export default router;
