import express from "express";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { Request, Response } from "express";
import "dotenv/config"; // これで .env が自動で読み込まれる
import cors from "cors";

const app = express();
app.use(cors());
const prisma = new PrismaClient();
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const cached = await redis.get("hello");
  if (cached) return res.send(`Cached: ${cached}`);

  const message = "Hello from Express + Prisma + Redis!";
  await redis.set("hello", message, "EX", 10);
  res.send(message);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
