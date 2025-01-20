import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";
import usersRoutes from "./routes/users.js";
import knexConfig from "../knexfile.js";
import initKnex from "knex";

const knex = initKnex(knexConfig);

// Initialize the app first
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.options("*", cors());
app.options("*", cors(corsOptions));

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
