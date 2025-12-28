const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Validate stock before creating order
    for (const item of orderItems) {
      const product = await Product.findById(item.product).select('countInStock');
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    // Update stock for each product
    const updatePromises = orderItems.map(item =>
      Product.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: -item.qty } },
        { new: true }
      )
    );
    await Promise.all(updatePromises);

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select('orderItems totalPrice status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Valid statuses
    const validStatuses = ["Pending", "Processing", "Completed", "Cancelled", "Returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
