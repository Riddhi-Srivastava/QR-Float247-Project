const express = require("express");

const {
  create,
  getAll,
  markRead,
  remove,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);

router.get("/", getAll);

router.patch("/:id/read", markRead);

router.delete("/:id", remove);

module.exports = router;