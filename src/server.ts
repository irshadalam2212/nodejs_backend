import app from "./app";
import dotenv from "dotenv";
import redisClient from "./config/redis";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await redisClient.connect();

    console.log("✅ Redis connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    process.exit(1);
  }
};

startServer();
