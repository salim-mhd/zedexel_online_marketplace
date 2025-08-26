import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/zedexel";

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI in .env.local");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend NodeJS global type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Use const instead of let to fix ESLint prefer-const error
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
    } catch (error: unknown) {
      cached.promise = null; // Reset promise on failure
      throw new Error(`MongoDB connection failed: ${error}`);
    }
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // Persist cache for module reuse
  return cached.conn;
}

export default dbConnect;
