import api from '@/lib/api';
import type { ApplicationStats } from '@/types/analytics';

export const analyticsService = {
    async getStats(): Promise<ApplicationStats> {
        const response = await api.get<ApplicationStats>('/analytics');
        return response.data;
    },
};
