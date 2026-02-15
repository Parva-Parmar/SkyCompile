import "./env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import projectRoutes from "./routes/project.route";
import friendRoutes from "./routes/friend.route";
import filesRoutes from "./routes/files.route";
import http from "http";
import { Server } from "socket.io";
import { setupTerminal } from "./terminal/terminal.manager";
import chokidar from "chokidar";
import path from "path";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);


app.use(express.json());

app.get("/api/v1/landing", (req, res) => {
  res.json({
    appName: "SkyCompile",
    tagline: "Collaborative project builder",
    status: "Backend connected successfully 🚀",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/friends", friendRoutes);
app.use("/api/v1", filesRoutes);

const PROJECTS_ROOT = path.resolve(
  __dirname,
  "../skycompiler_projects"
);
const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

setupTerminal(io);
const watcher = chokidar.watch(PROJECTS_ROOT, {
  ignoreInitial: true,
  persistent: true,
});

watcher.on("all", (event: string, filePath: string) => {
  const relativePath = path.relative(PROJECTS_ROOT, filePath);

  io.emit("files:changed", {
    event,
    path: relativePath,
  });
});
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server + Terminal running on http://localhost:${PORT}`);
});


