const express = require("express");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
  updateStatus,
} = require("../controllers/adminCouponController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.patch("/:id/status", updateStatus);

module.exports = router;