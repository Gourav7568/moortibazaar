const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables");
}

// Use `globalThis` to persist connection across function calls in Vercel
let cached = globalThis.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB Atlas...");
    cached.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable
        socketTimeoutMS: 45000, // Keep the connection alive for longer queries
      })
      .then((mongoose) => {
        console.log("🚀 Connected to MongoDB Atlas");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

globalThis.mongoose = cached; // Store cache globally
module.exports = connectDB;
