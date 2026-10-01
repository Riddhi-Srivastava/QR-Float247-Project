const express = require("express");

const {
  create,
  getMyOrders,
  getOne,
  updateStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", create);

router.get("/", getMyOrders);

router.get("/:id", getOne);

router.put("/:id/status", updateStatus);

module.exports = router;