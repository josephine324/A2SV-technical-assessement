import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  createProduct,
  createProductSchema,
  listProducts,
  updateProduct,
  updateProductSchema,
} from '../controllers/productController';

const router = Router();

router.get('/', listProducts);

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('Admin'),
  validate(updateProductSchema),
  updateProduct
);

export default router;

