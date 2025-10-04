import mongoose from "mongoose";

let cached = global.mongoose; // use global to cache across function calls

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(mongo_url) {
  if (cached.conn) {
    // Return existing connection
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongo_url, {
        // options
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "YOUR_DB_NAME", // replace with your DB name
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("🚫 MongoDB connection failed", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
