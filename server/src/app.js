import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import lostFoundRoutes from './routes/lostFoundRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'CampusCircle API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (supporting both /api/* and root /* for Vercel Serverless)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/marketplace', '/marketplace'], marketplaceRoutes);
app.use(['/api/lost-found', '/lost-found'], lostFoundRoutes);
app.use(['/api/stats', '/stats'], statsRoutes);

// Serve frontend static assets if client/dist exists (Fullstack production deployments)
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
