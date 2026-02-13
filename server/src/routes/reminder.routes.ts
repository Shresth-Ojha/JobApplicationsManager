import { Router } from 'express';
import { ReminderController } from '../controllers/reminder.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const reminderController = new ReminderController();

router.use(authenticateToken);

router.get('/', reminderController.getDueReminders);
router.post('/:id/acknowledge', reminderController.acknowledgeReminder);

export default router;
