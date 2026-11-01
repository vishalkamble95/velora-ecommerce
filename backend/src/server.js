
import "dotenv/config";

import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

const startServer = async () => {
  let server;

  try {
    await connectDatabase();

    server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async (error) => {
        if (error) {
          console.error("Error closing HTTP server:", error);
          process.exitCode = 1;
        }

        const mongoose = await import("mongoose");

        await mongoose.default.connection.close();

        console.log("Database connection closed.");
        process.exit();
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Application startup failed:", error.message);
    process.exitCode = 1;
  }
};

startServer();
