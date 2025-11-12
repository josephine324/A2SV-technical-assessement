import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { createProduct, createProductSchema } from '../controllers/productController';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  validate(createProductSchema),
  createProduct
);

export default router;

