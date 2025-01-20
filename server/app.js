import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";
import usersRoutes from "./routes/users.js";
import knexConfig from "../knexfile.js";
import initKnex from "knex";

const knex = initKnex(knexConfig);

// Initialize express app
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "https://savoury-solutions.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Pre-flight requests
app.options("*", cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/users", usersRoutes);
app.get("/", (req, res) => {
  res.send("Hello");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
