const express = require("express");

const {
  create,
  getAll,
  getOne,
  remove,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public: restaurant reviews
router.get("/restaurant/:restaurantId", getAll);

// Protected routes
router.use(authMiddleware);

router.post("/", create);

router.get("/:id", getOne);

router.delete("/:id", remove);

module.exports = router;