const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const upload = require("../middleware/upload.middleware");
const uploadToFirebase = require("../middleware/firebaseUpload.middleware");
const { protect } = require("../middleware/auth.middleware");

router.get("/", serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

router.post(
  "/create",
  protect,
  upload.single("image"),
  uploadToFirebase,
  serviceController.createService
);
router.put("/:id", protect, serviceController.updateService);
router.delete("/:id", protect, serviceController.deleteService);

module.exports = router;
