import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/me', authenticateToken, authController.me);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/password', authenticateToken, authController.changePassword);

export default router;
