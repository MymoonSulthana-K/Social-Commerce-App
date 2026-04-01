const express = require("express");
const {
  getDashboardStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  getUserDetails,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  getReferrals,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);

router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);

router.get("/orders", getOrders);
router.get("/orders/:id", getOrderDetails);
router.put("/orders/:id/status", updateOrderStatus);

router.get("/referrals", getReferrals);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
