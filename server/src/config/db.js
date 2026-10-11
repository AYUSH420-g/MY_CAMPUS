import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.resolve(__dirname, '../..');
const workspaceDir = path.resolve(__dirname, '../../..');

// Load env from server/.env and root .env
dotenv.config({ path: path.join(serverDir, '.env') });
dotenv.config({ path: path.join(workspaceDir, '.env') });

process.env.MONGOMS_DOWNLOAD_DIR = path.join(workspaceDir, '.mongodb-binaries');

let memoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;

  if (primaryUri) {
    try {
      const maskedUri = primaryUri.replace(/:([^@]+)@/, ':****@');
      console.log(`[DB] Connecting to MongoDB Atlas: ${maskedUri}...`);
      await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`[DB] Successfully connected to MongoDB Atlas!`);
      return;
    } catch (err) {
      console.error(`[DB] Failed to connect to MongoDB Atlas (${err.message}). Falling back to In-Memory MongoDB...`);
    }
  }

  // Fallback to MongoMemoryServer for offline development
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'campuscircle',
      },
    });
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[DB] Connected to In-Memory MongoDB at: ${memUri}`);
  } catch (memErr) {
    console.error('[DB] Failed to start in-memory MongoDB:', memErr.message);
    throw memErr;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
