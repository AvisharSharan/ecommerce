const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const Order = require("../models/Order");
const { createOrder, getMyOrders, updateOrderStatus } = require("../controllers/orderController");

router.post("/", protect, createOrder);      // Place order
router.get("/myorders", protect, getMyOrders); // Get logged-in user's orders
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/:id/status", protect, admin, updateOrderStatus); // Update order status

module.exports = router;
