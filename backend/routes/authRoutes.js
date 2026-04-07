const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  checkAuth,
  checkAdmin,
  logout
} = require("../controllers/authController");

// Auth core
router.post("/register", registerUser);
router.post("/login", loginUser);

// Auth helpers
router.get("/check", checkAuth);
router.get("/admin/check", checkAdmin);
router.post("/logout", logout);

module.exports = router;