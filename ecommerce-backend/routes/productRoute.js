const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected route (admin only)
router.post("/", protect, admin, createProduct);

module.exports = router;
