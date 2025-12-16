import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import pool from "./db/pool.js";
import projectsRouter from "./routes/projects.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/projects", projectsRouter);

// optional health check
app.get("/", (_req, res) => {
  res.send("API is running");
});

// temporary DB test (remove later)
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL is reachable");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed", err);
  }
})();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
