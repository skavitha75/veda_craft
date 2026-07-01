import { Router } from 'express';
import { checkDeliveryAvailability } from '../controllers/deliveryController.js';

const router = Router();

// GET /api/v1/delivery/check-state?state=XYZ
router.get('/check-state', checkDeliveryAvailability);

export default router;
