import { Router } from 'express';
import { register, signupSchema } from '../controllers/authController';
import { validate } from '../middlewares/validate';

const router = Router();

router.post('/register', validate(signupSchema), register);

export default router;