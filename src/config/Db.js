import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB(mongo_url) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
