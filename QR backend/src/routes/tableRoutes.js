const express = require("express");

const {
  create,
  getAll,
  updateStatus,
} = require("../controllers/tableController");

const {
  getTableQR,
} = require("../controllers/qrController");

const router = express.Router();

router.post("/", create);

router.get("/", getAll);

router.patch("/:id/status", updateStatus);

router.get("/:id/qr", getTableQR);

module.exports = router;