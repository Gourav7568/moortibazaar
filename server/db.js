const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

global.mongoose = cached;
module.exports = connectDB;
