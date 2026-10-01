const express = require("express");

const {
  create,
  confirm,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", create);
router.patch("/:orderId/confirm", confirm);

module.exports = router;