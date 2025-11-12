import { Router } from 'express';
import {
  register,
  login,
  signupSchema,
  loginSchema,
} from '../controllers/authController';
import { validate } from '../middlewares/validate';

const router = Router();

router.post('/register', validate(signupSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;