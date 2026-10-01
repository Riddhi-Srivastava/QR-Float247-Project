const express = require("express");

const {
  add,
  getAll,
  remove,
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add food to favorites
router.post("/", authMiddleware, add);

// Get logged-in user's favorites
router.get("/", authMiddleware, getAll);

// Remove food from favorites
router.delete("/:foodId", authMiddleware, remove);

module.exports = router;