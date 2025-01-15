import express from "express";
import db from "../database/connection.js";

const router = express.Router();

// Get all favourite recipes
router.get("/", (req, res) => {
  db.query("SELECT * FROM favourites", (err, results) => {
    if (err) {
      console.error("Error fetching favourites:", err);
      return res.status(500).json({ message: "Error fetching favourites" });
    }
    res.json(results);
  });
});

// Add a recipe to favourites
router.post("/", (req, res) => {
  const { idMeal, strMeal, strMealThumb } = req.body;

  // Check if the recipe already exists
  db.query(
    "SELECT * FROM favourites WHERE idMeal = ?",
    [idMeal],
    (err, results) => {
      if (err) {
        console.error("Error checking existing recipe:", err);
        return res.status(500).json({ message: "Error checking recipe" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Recipe already in favourites" });
      }

      // Insert the recipe into the database
      const query =
        "INSERT INTO favourites (idMeal, strMeal, strMealThumb) VALUES (?, ?, ?)";
      db.query(query, [idMeal, strMeal, strMealThumb], (err) => {
        if (err) {
          console.error("Error adding recipe to favourites:", err);
          return res.status(500).json({ message: "Error adding recipe" });
        }
        res.status(201).json({ message: "Recipe added to favourites" });
      });
    }
  );
});

// Remove a recipe from favourites
router.delete("/:idMeal", (req, res) => {
  const { idMeal } = req.params;

  db.query("DELETE FROM favourites WHERE idMeal = ?", [idMeal], (err) => {
    if (err) {
      console.error("Error removing recipe:", err);
      return res.status(500).json({ message: "Error removing recipe" });
    }
    res.status(200).json({ message: "Recipe removed from favourites" });
  });
});

export default router;
