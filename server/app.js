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
const port = process.env.PORT || 5173;

// Custom middleware to set CORS headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://savoury-solutions.netlify.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Also keep the cors middleware as a backup
app.use(
  cors({
    origin: "https://savoury-solutions.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.use(express.json());
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
