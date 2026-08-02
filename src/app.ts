import express, { Request, Response } from "express";
import userRoutes from "./modules/user/user.routes";

const app = express();

app.use(express.json());

//routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Complete Node.js Backend Course 🚀");
});

app.use("/api/v1/users", userRoutes);

export default app;
