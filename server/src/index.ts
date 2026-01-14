import "./env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import projectRoutes from "./routes/project.route";
import friendRoutes from "./routes/friend.route";
import filesRoutes from "./routes/files.route";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
