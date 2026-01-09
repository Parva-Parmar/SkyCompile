import express from "express";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());

 
app.use("/api/v1/auth", authRoutes);

app.listen(3000);
console.log("Server is running on http://localhost:3000");