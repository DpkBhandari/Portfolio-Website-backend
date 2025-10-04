import app from "./app.js";

import config from "./config/config.js";

import connectDB from "./config/Db.js";

async function startServer() {
  try {
    const port = config.port;
    const mongo_Url = config.mongo_Url;

    console.log(mongo_Url);
    await connectDB(mongo_Url);

    const server = app.listen(port, () => {
      console.log(`Server On http://localhost:${port}`);

      // ✅  shutdown
      const shutdown = (signal) => {
        console.log(`${signal} received. Closing server...`);
        server.close(() => {
          console.log("Server closed.");
          process.exit(0);
        });
      };

      process.on("SIGINT", () => shutdown("SIGINT"));
      process.on("SIGTERM", () => shutdown("SIGTERM"));

      // ✅ Handle unhandled rejections & uncaught exceptions
      process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection:", err);
        server.close(() => process.exit(1));
      });

      process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        server.close(() => process.exit(1));
      });
    });
  } catch (error) {
    console.log(`Server :${error}`);
    process.exit(1);
  }
}

startServer();
