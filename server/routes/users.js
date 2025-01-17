import "dotenv/config";
import initKnex from "knex";
import knexConfig from "../../knexfile.js";
const knex = initKnex(knexConfig);
import express from "express";
import authorize from "../middleware/auth.js";

const router = express.Router();

// Libraries to create JWT tokens and hash passwords
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Custom middleware to check JWT tokens on protected routes
import authorise from "../middleware/auth.js";

// Used when hashing the user's password (more salt rounds = stronger encryption)
const SALT_ROUNDS = 8;

// Register Route
router.post("/register", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "You must provide a name, email, and password" });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const newUserIds = await knex("users").insert({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await knex("users").where({ id: newUserIds[0] }).first();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ msg: `Couldn't create new user: ${error.message}` });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "You must provide an email and password" });
  }

  try {
    // Query the DB for a user with the email address provided in the request body
    const user = await knex("users").where({ email: req.body.email }).first();

    // Use bcrypt to check whether the password sent in the request body matches the hashed password in the DB
    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res
        .status(403)
        .json({ message: "Username/Password combination is incorrect" });
    }

    // Use the jwt library to generate a JWT token for the user.
    // Include the id and email of the user in the payload of the JWT
    // We can access the data in the payload of the JWT later (when the user accesses a protected page)
    const token = jwt.sign(
      {
        id: user.id,
        sub: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Send the JWT token to the client
    res.json({ authToken: token });
  } catch (error) {
    res.status(400).json({ message: "User not found" });
  }
});

// Add a recipe to favourites
router.post("/favourites", authorize, async (req, res) => {
  const { recipe_id, recipe_name, recipe_image } = req.body;

  if (!recipe_id || !recipe_name || !recipe_image) {
    return res.status(400).json({ msg: "Recipe details are required" });
  }

  try {
    // Check if the recipe already exists in favourites for the logged-in user
    const favouriteExists = await knex("favourites")
      .where({ user_id: req.token.id, recipe_id })
      .first();

    if (favouriteExists) {
      return res.status(409).json({ msg: "Recipe already in favourites" });
    }

    // Insert the new favourite into the database
    await knex("favourites").insert({
      user_id: req.token.id,
      recipe_id,
      recipe_name,
      recipe_image,
    });

    res.status(201).json({ msg: "Recipe added to favourites" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error adding to favourites: ${error.message}` });
  }
});

// Get all favourites for the logged-in user
router.get("/favourites", authorize, async (req, res) => {
  try {
    const favourites = await knex("favourites")
      .where({ user_id: req.token.id })
      .select("recipe_id", "recipe_name", "recipe_image");

    res.json(favourites);
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error fetching favourites: ${error.message}` });
  }
});

// Remove a recipe from favourites
router.delete("/favourites/:recipe_id", authorize, async (req, res) => {
  const { recipe_id } = req.params;

  try {
    const deleted = await knex("favourites")
      .where({ user_id: req.token.id, recipe_id })
      .del();

    if (!deleted) {
      return res.status(404).json({ msg: "Recipe not found in favourites" });
    }

    res.json({ msg: "Recipe removed from favourites" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error removing from favourites: ${error.message}` });
  }
});
export default router;
