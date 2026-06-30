import { Router } from 'express';
import * as recentSearchController from '../controllers/recentSearchController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication — no guest access
router.get('/', authenticate, recentSearchController.getRecentSearches);
router.post('/', authenticate, recentSearchController.saveRecentSearch);
router.delete('/clear', authenticate, recentSearchController.clearRecentSearches);
router.delete('/', authenticate, recentSearchController.deleteRecentSearch);

export default router;
