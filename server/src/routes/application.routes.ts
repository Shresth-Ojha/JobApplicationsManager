import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const applicationController = new ApplicationController();

router.use(authenticateToken); // Protect all application routes

router.get('/', applicationController.getAll);
router.get('/:id', applicationController.getById);
router.post('/', applicationController.create);
router.put('/:id', applicationController.update);
router.delete('/:id', applicationController.delete);

export default router;
