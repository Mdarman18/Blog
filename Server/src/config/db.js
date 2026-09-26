import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  const conn = await mongoose.connect(env.MONGO_URI);
  console.log(`🗄️  MongoDB connected: ${conn.connection.host}`);
  return conn;
}
