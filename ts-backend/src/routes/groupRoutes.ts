import { createGroup } from '@/controllers/groupController';
import { teacherAuthMiddleware } from '@/middleware/authMiddleware';
import { Router } from 'express';

const router = Router();

router.post('/create',teacherAuthMiddleware , createGroup )

export default router;
