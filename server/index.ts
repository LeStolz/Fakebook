import { config } from "dotenv";
config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { users } from "./routes/users";

mongoose.connect(process.env.DATABASE_URL!);
mongoose.connection.on("error", (error: Error) => console.error(error));
mongoose.connection.once("open", () => console.log("Connected to database"));

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use("/users", users);

app.listen({ port: parseInt(process.env.PORT!) }, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
