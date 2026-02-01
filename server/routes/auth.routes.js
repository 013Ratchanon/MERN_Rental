const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
// Register, Login, and Verify routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify", authController.verify);

module.exports = router;
