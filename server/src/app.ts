import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { globalLimiter } from './middleware/rateLimit.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './routes/auth.routes';
import applicationRoutes from './routes/application.routes';
import analyticsRoutes from './routes/analytics.routes';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
