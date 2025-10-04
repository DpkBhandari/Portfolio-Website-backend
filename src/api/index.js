// api/index.js
import app from "../src/app.js";
import connectDB from "../config/Db.js";
import config from "../config/config.js";

const mongo_url = config.mongo_Url;

export default async function handler(req, res) {
  try {
    await connectDB(mongo_url);

    app(req, res);
  } catch (err) {
    console.error("Serverless error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
