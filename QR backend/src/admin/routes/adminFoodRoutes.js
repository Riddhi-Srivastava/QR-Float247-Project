const express = require("express");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
  availability,
} = require("../controllers/adminFoodController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const { uploadImage } = require("../controllers/adminImageController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/upload-image", upload.single("image"), uploadImage);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.patch("/:id/availability", availability);

module.exports = router;