const express = require("express");

const {
  getAll,
  getOne,
  updateStatus,
} = require("../controllers/adminOrderController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id/status", updateStatus);

module.exports = router;