import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[Seed] Finished successfully.');
    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

runSeed();
