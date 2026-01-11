import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/**
 * ✅ CORS — MUST be before routes
 */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin (Vite)
  })
);

/**
 * ✅ JSON parser — before routes
 */
app.use(express.json());

/**
 * ✅ Public landing endpoint
 */
app.get("/api/v1/landing", (req, res) => {
  res.json({
    appName: "SkyCompile",
    tagline: "Collaborative project builder",
    status: "Backend connected successfully 🚀",
  });
});

/**
 * ✅ Auth routes
 */
app.use("/api/v1/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
