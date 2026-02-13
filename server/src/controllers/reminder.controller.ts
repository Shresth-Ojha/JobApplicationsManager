import { Request, Response } from 'express';
import { ReminderService } from '../services/reminder.service';

const reminderService = new ReminderService();

export class ReminderController {
    async getDueReminders(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const reminders = await reminderService.getDueReminders(userId);
            res.json(reminders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async acknowledgeReminder(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await reminderService.acknowledgeReminder(id, userId);
            res.json({ success: true });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
