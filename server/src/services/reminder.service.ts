import prisma from '../prisma';
import { ApplicationStatus } from '@prisma/client';

export class ReminderService {
    async getDueReminders(userId: string) {
        const now = new Date();

        const applications = await prisma.application.findMany({
            where: {
                userId,
                deletedAt: null,
                reminderEnabled: true,
                status: {
                    notIn: [ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
                },
            },
            select: {
                id: true,
                companyName: true,
                positionTitle: true,
                status: true,
                reminderDays: true,
                lastReminderAck: true,
                updatedAt: true,
            },
        });

        // Filter applications where enough time has elapsed since last acknowledgment
        return applications.filter((app) => {
            const dueDate = new Date(app.lastReminderAck);
            dueDate.setDate(dueDate.getDate() + app.reminderDays);
            return now >= dueDate;
        });
    }

    async acknowledgeReminder(applicationId: string, userId: string) {
        const application = await prisma.application.findFirst({
            where: { id: applicationId, userId, deletedAt: null },
        });

        if (!application) {
            throw new Error('Application not found');
        }

        return prisma.application.update({
            where: { id: applicationId },
            data: { lastReminderAck: new Date() },
        });
    }
}
