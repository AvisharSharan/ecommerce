const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserOrders,
} = require("../controllers/userController");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserAccount);
router.get("/orders", protect, getUserOrders);

module.exports = router;
