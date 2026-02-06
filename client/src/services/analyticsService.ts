import api from '@/lib/api';
import type { ApplicationStats } from '@/types/analytics';
import { useAuthStore } from '@/store/authStore';

const isGuestMode = () => useAuthStore.getState().isGuest;

const getGuestStats = (): ApplicationStats => {
    const data = localStorage.getItem('guest-applications');
    const applications = data ? JSON.parse(data) : [];

    const byStatus: { status: string; count: number }[] = [];
    const statusCounts: Record<string, number> = {};

    applications.forEach((app: { status: string }) => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count]) => {
        byStatus.push({ status, count });
    });

    return {
        totalApplications: applications.length,
        byStatus,
        recentActivity: [],
    };
};

export const analyticsService = {
    async getStats(): Promise<ApplicationStats> {
        if (isGuestMode()) return getGuestStats();
        const response = await api.get<ApplicationStats>('/analytics');
        return response.data;
    },
};

