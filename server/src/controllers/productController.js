import * as productService from '../services/productService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const getProducts = async (req, res, next) => {
  try {
    const { products, meta } = await productService.getProducts(req.productQuery);
    return sendSuccess(res, products, 'Products retrieved successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductByIdOrSlug(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess(res, product, 'Product retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { products, meta } = await productService.getProductsByCategory(
      req.params.category,
      req.productQuery
    );

    return sendSuccess(res, products, 'Products retrieved successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const search = req.query.q || req.query.search || '';
    const { products, meta } = await productService.searchProducts(search, req.productQuery);
    return sendSuccess(res, products, 'Products retrieved successfully', 200, meta);
  } catch (error) {
    return next(error);
  }
};
