import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` CampusCircle API Server running on port ${PORT} `);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
      console.log(` http://localhost:${PORT}/api/health `);
      console.log(`===============================================`);
    });

    const gracefulShutdown = () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (err) {
    console.error('[Server] Failed to initialize:', err);
    process.exit(1);
  }
};

startServer();
