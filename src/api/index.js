// api/index.js
import app from "../src/app.js";
import connectDB from "../src/config/Db.js";
import config from "../src/config/config.js";

const mongo_url = config.mongo_Url;

export default async function handler(req, res) {
  try {
    await connectDB(mongo_url); // ensures DB is ready
    app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
