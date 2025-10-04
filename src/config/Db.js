import mongoose from "mongoose";

let cached = global.mongoose; // global cache for serverless

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB(mongo_url) {
  if (cached.conn) {
    return cached.conn; // return existing connection
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
