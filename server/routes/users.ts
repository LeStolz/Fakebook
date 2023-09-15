import express from "express";
import { User } from "../models/User";

export const users = express.Router();

users.post<{ body: {} }>("/login", async (req, res) => {});
