const express = require("express");

const {
  create,
  getAll,
  validate,
} = require("../controllers/couponController");

const router = express.Router();

router.post("/", create);

router.get("/", getAll);

router.post("/validate", validate);

module.exports = router;