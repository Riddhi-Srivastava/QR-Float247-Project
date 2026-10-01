const express = require("express");

const {
  getAll,
  create,
  update,
  remove,
} = require("../controllers/adminRestaurantController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;