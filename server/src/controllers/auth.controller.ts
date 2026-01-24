import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const authService = new AuthService();

const registerSchema = z.object({
    email: z.string().email().max(254).transform(v => v.toLowerCase().trim()),
    password: z.string().min(8).max(128),
    firstName: z.string().max(100).transform(v => v.trim()).optional(),
    lastName: z.string().max(100).transform(v => v.trim()).optional(),
}).strict();

const loginSchema = z.object({
    email: z.string().email().max(254).transform(v => v.toLowerCase().trim()),
    password: z.string().max(128),
}).strict();

const updateProfileSchema = z.object({
    firstName: z.string().max(100).transform(v => v.trim()).optional(),
    lastName: z.string().max(100).transform(v => v.trim()).optional(),
    phone: z.string().max(20).optional(),
    resumeUrl: z.string().url().max(2000).optional().or(z.literal('')),
    addressStreet: z.string().max(200).optional(),
    addressCity: z.string().max(100).optional(),
    addressState: z.string().max(100).optional(),
    addressZip: z.string().max(20).optional(),
    addressCountry: z.string().max(100).optional(),
    education: z.array(z.object({
        institution: z.string().max(200),
        degree: z.string().max(100),
        fieldOfStudy: z.string().max(100).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    })).max(20).optional(),
    experience: z.array(z.object({
        company: z.string().max(200),
        title: z.string().max(200),
        location: z.string().max(200).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().max(2000).optional(),
    })).max(20).optional(),
}).strict();

const changePasswordSchema = z.object({
    currentPassword: z.string().max(128),
    newPassword: z.string().min(8).max(128),
}).strict();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const data = registerSchema.parse(req.body);
            const result = await authService.register(
                data.email,
                data.password,
                data.firstName,
                data.lastName
            );
            res.status(201).json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = loginSchema.parse(req.body);
            const result = await authService.login(data.email, data.password);
            res.json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors });
            }
            res.status(401).json({ error: error.message });
        }
    }

    async me(req: Request, res: Response) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const user = await authService.getUser(req.user.id);
            res.json({ user });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });
            const data = updateProfileSchema.parse(req.body);
            const user = await authService.updateProfile(req.user.id, data);
            res.json({ user });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });
            const data = changePasswordSchema.parse(req.body);
            const result = await authService.changePassword(req.user.id, data.currentPassword, data.newPassword);
            res.json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }
}
