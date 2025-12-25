const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createOrder, getMyOrders } = require("../controllers/OrderController");

router.post("/", protect, createOrder);      // Place order
router.get("/myorders", protect, getMyOrders); // Get logged-in user's orders

module.exports = router;
