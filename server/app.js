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
// app.use(express.urlencoded({ extended: true }));
// // CORS configuration
// const corsOptions = {
//   origin: ["https://savoury-solutions.netlify.app", "http://localhost:5173"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: "*",
//   credentials: true,
// };

// // Apply CORS with options
// app.use(cors(corsOptions));
app.use(cors({ origin: "https://savoury-solutions.netlify.app", "http://localhost:5173" }));
app.options("*", cors()); 
app.use(express.json());

// Routes
app.use("/users", usersRoutes);
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
