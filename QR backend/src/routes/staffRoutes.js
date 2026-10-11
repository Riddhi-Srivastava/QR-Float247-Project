const express = require("express");

const {
  create,
  getAll,
  updateRole,
  remove,
} = require("../controllers/staffController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);

router.get("/restaurant/:restaurantId", getAll);

router.patch("/:id/role", updateRole);

router.delete("/:id", remove);

module.exports = router;