import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import {
  validateProductId,
  validateProductQuery,
} from '../validations/productValidation.js';

const router = Router();

router.get('/', validateProductQuery, productController.getProducts);
router.get('/search', validateProductQuery, productController.searchProducts);
router.get('/category/:category', validateProductQuery, productController.getProductsByCategory);
router.get('/:id', validateProductId, productController.getProductById);

export default router;
