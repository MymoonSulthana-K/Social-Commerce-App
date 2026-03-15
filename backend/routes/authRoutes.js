const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;