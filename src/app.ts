import express, { Request, Response } from "express";
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { getCache, setCache } from "./services/redis.services";

const app = express();

app.use(express.json());

//routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Complete Node.js Backend Course 🚀");
});

app.get("/redis-test", async (req, res) => {
  await setCache("test:name", "Irshad", 60);

  const value = await getCache("test:name");

  res.json({
    success: true,
    value,
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

//global error handler
app.use(globalErrorHandler);

export default app;
