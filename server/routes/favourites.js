import express from "express";
import knex from "../../knexfile.js";
import authorize from "../middleware/auth.js";

const router = express.Router();

// Add a recipe to favourites
router.post("/favourites", authorize, async (req, res) => {
  const { recipe_id, recipe_name, recipe_image } = req.body;

  if (!recipe_id || !recipe_name || !recipe_image) {
    return res.status(400).json({ msg: "Recipe details are required" });
  }

  try {
    const favouriteExists = await knex("favourites")
      .where({ user_id: req.token.id, recipe_id })
      .first();

    if (favouriteExists) {
      return res.status(409).json({ msg: "Recipe already in favourites" });
    }

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
