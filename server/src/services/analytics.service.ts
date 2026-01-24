import prisma from '../prisma';

export class AnalyticsService {
    async getApplicationStats(userId: string) {
        const totalApplications = await prisma.application.count({
            where: { userId },
        });

        const byStatus = await prisma.application.groupBy({
            by: ['status'],
            where: { userId },
            _count: {
                _all: true,
            },
        });

        const recentActivity = await prisma.application.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            take: 5,
            select: {
                id: true,
                companyName: true,
                positionTitle: true,
                status: true,
                updatedAt: true,
            },
        });

        return {
            totalApplications,
            byStatus: byStatus.map((item) => ({
                status: item.status,
                count: item._count._all,
            })),
            recentActivity,
        };
    }
}
