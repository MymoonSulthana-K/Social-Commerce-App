const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;