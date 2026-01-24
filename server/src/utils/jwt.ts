import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export const generateTokens = (user: User) => {
    const payload = {
        id: user.id,
        email: user.email,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET as Secret, {
        expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET as Secret, {
        expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET as Secret);
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET as Secret);
    } catch (error) {
        return null;
    }
};
