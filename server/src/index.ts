import express from "express";
import authRoutes from "./routes/auth.route";
import dotenv from "dotenv";
dotenv.config();


const app = express();
 
app.get("/api/v1/landing", (req, res) => {
  res.json({
    appName: "SkyCompile",
    tagline: "Collaborative project builder",
    status: "Backend connected successfully 🚀",
  });
});

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});