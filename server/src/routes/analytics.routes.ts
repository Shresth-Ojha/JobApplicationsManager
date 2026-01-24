import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticateToken);

router.get('/', analyticsController.getStats);

export default router;
