import { config } from "dotenv";
import mongoose from "mongoose";
import { createContext, t } from "./trpc";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { users } from "./routes/users";

config();

mongoose.connect(process.env.DATABASE_URL!);
mongoose.connection.on("error", (error) => console.error(error));
mongoose.connection.once("open", () =>
  console.log("Server connected to database")
);

const appRouter = t.router({
  users,
});

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
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
