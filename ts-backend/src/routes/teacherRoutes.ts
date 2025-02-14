import { Router } from 'express';
import { teacherSignUpController, teacherLoginController } from '../controllers/teacherController';


const router = Router();

router.post('/signup', teacherSignUpController);
router.post('/login', teacherLoginController);

export default router;
