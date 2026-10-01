const express = require("express");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
  setDefault,
} = require("../controllers/addressController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", update);

router.delete("/:id", remove);

router.patch("/:id/default", setDefault);

module.exports = router;