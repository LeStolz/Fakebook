import { config } from "dotenv";
import mongoose from "mongoose";
import { t } from "./trpc";
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./contexts";
import { users } from "./routes/users";

config();

mongoose.connect(process.env.DATABASE_URL!);
mongoose.connection.on("error", (error: Error) => console.error(error));
mongoose.connection.once("open", () => console.log("Connected to database"));

const appRouter = t.router({
  users,
});

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen({ port: parseInt(process.env.PORT!) }, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export type AppRouter = typeof appRouter;
