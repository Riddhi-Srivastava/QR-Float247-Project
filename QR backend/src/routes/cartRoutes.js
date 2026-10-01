const express = require("express");

const {
  get,
  add,
  update,
  remove,
  clear,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", get);

router.post("/items", add);

router.put("/items/:id", update);

router.delete("/items/:id", remove);

router.delete("/", clear);

module.exports = router;