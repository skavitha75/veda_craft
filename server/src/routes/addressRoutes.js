import express from 'express';
import * as addressController from '../controllers/addressController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All address routes require authentication
router.use(authenticate);

router.get('/', addressController.getAddresses);
router.post('/', addressController.addAddress);
router.get('/:id', addressController.getAddressById);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.put('/:id/default', addressController.setDefaultAddress);

export default router;
