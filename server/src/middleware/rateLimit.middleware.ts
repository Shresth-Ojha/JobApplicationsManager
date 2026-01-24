import rateLimit from 'express-rate-limit';

// Global rate limiter - 100 requests per 15 minutes
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth rate limiter - 5 requests per 15 minutes (strict for login/register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// API rate limiter - 50 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: 'Too many API requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
