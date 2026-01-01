const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const Order = require("../models/Order");
const { createOrder, getMyOrders, updateOrderStatus } = require("../controllers/orderController");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .select('user orderItems totalPrice status createdAt')
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
