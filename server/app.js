import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import favouritesRoutes from "./routes/favourites.js";
import cors from "cors";

// Initialize the app first
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/favourites", favouritesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
