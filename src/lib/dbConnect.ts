import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zedexel' as string;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  console.log('MONGODB_URI', MONGODB_URI);
  
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
