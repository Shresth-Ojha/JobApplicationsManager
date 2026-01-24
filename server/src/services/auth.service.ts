import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { generateTokens } from '../utils/jwt';
import { User } from '@prisma/client';
import { AuthResponse } from '../types';

export class AuthService {
    async register(
        email: string,
        password: string,
        firstName?: string,
        lastName?: string
    ): Promise<AuthResponse> {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
            },
        });

        const tokens = generateTokens(user);

        return {
            user: this.sanitizeUser(user),
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const tokens = generateTokens(user);

        return {
            user: this.sanitizeUser(user),
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async updateProfile(userId: string, data: { firstName?: string; lastName?: string; email?: string }) {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
        });
        return this.sanitizeUser(user);
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) throw new Error('Invalid current password');

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        return { message: 'Password updated successfully' };
    }

    async getUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return this.sanitizeUser(user);
    }

    private sanitizeUser(user: User) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, verificationToken, resetToken, ...sanitized } = user;
        return sanitized;
    }
}
