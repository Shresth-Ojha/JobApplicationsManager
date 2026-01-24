import prisma from '../prisma';
import { Application, ApplicationStatus, PriorityLevel } from '@prisma/client';

export class ApplicationService {
    async getAll(userId: string) {
        return prisma.application.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async getById(id: string, userId: string) {
        return prisma.application.findFirst({
            where: { id, userId },
        });
    }

    async create(userId: string, data: Partial<Application>) {
        return prisma.application.create({
            data: {
                ...data,
                userId,
                status: data.status || ApplicationStatus.APPLIED,
                priority: data.priority || PriorityLevel.MEDIUM,
            } as any,
        });
    }

    async update(id: string, userId: string, data: Partial<Application>) {
        const application = await this.getById(id, userId);
        if (!application) {
            throw new Error('Application not found');
        }

        return prisma.application.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, userId: string) {
        const application = await this.getById(id, userId);
        if (!application) {
            throw new Error('Application not found');
        }

        return prisma.application.delete({
            where: { id },
        });
    }
}
