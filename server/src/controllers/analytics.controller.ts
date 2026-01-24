import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
    async getStats(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const stats = await analyticsService.getApplicationStats(userId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
