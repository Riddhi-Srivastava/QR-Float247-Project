const express = require("express");

const {
  dashboard,
  getUsers,
  getOrders,
} = require("../controllers/adminController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", dashboard);
router.get("/users", getUsers);
router.get("/orders", getOrders);

module.exports = router;  