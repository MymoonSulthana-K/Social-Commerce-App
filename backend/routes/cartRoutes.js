const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeItem,
  updateQuantity
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addToCart);
router.get("/cart", protect, getCart);
router.post("/remove", protect, removeItem);
router.post("/update", protect, updateQuantity);

module.exports = router;