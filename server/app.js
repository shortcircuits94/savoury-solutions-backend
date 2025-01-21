import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";
import usersRoutes from "./routes/users.js";
import knexConfig from "../knexfile.js";
import initKnex from "knex";

const knex = initKnex(knexConfig);

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    "https://savoury-solutions.netlify.app",
    // Add other allowed origins if needed
    "http://localhost:5173", // For local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If you're using cookies or authentication headers
  optionsSuccessStatus: 200,
};

// Apply CORS with configuration
app.use(cors(corsOptions));
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use("/users", usersRoutes);
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
