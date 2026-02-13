import { Request, Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { z } from 'zod';

const applicationService = new ApplicationService();

const createApplicationSchema = z.object({
    companyName: z.string().min(1).max(200).transform(v => v.trim()),
    positionTitle: z.string().min(1).max(200).transform(v => v.trim()),
    jobDescription: z.string().max(10000).optional(),
    jobUrl: z.string().url().max(2000).optional().or(z.literal('')),
    locationCity: z.string().max(100).optional(),
    notes: z.string().max(5000).optional(),
    status: z.enum(['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'OFFER_RECEIVED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    reminderEnabled: z.boolean().optional(),
    reminderDays: z.number().int().min(1).max(365).optional(),
}).strict();

const updateApplicationSchema = z.object({
    companyName: z.string().min(1).max(200).transform(v => v.trim()).optional(),
    positionTitle: z.string().min(1).max(200).transform(v => v.trim()).optional(),
    jobDescription: z.string().max(10000).optional(),
    jobUrl: z.string().url().max(2000).optional().or(z.literal('')),
    locationCity: z.string().max(100).optional(),
    notes: z.string().max(5000).optional(),
    status: z.enum(['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'OFFER_RECEIVED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    applicationDate: z.string().optional(),
    salary: z.string().max(100).optional(),
    contactName: z.string().max(100).optional(),
    contactEmail: z.string().email().max(254).optional().or(z.literal('')),
    contactPhone: z.string().max(20).optional(),
    reminderEnabled: z.boolean().optional(),
    reminderDays: z.number().int().min(1).max(365).optional(),
}).strict();

export class ApplicationController {
    async getAll(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const applications = await applicationService.getAll(userId);
            res.json(applications);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const application = await applicationService.getById(id, userId);

            if (!application) {
                return res.status(404).json({ error: 'Application not found' });
            }

            res.json(application);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const data = createApplicationSchema.parse(req.body);
            const application = await applicationService.create(userId, data as any);
            res.status(201).json(application);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const data = updateApplicationSchema.parse(req.body);
            const application = await applicationService.update(id, userId, data as any);
            res.json(application);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await applicationService.delete(id, userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
