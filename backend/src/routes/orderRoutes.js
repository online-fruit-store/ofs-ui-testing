const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (
      !req.isAuthenticated() ||
      (req.user.id !== parseInt(userId) && req.user.role !== "admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const ordersResult = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await pool.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.img_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );

      order.items = itemsResult.rows;
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderResult = await pool.query(
      `SELECT o.*, 
              p.transaction_id,
              p.last4
       FROM orders o
       LEFT JOIN payments p ON p.amount = o.total AND DATE_TRUNC('minute', p.created_at) = DATE_TRUNC('minute', o.created_at)
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    if (
      !req.isAuthenticated() ||
      (req.user.id !== order.user_id && req.user.role !== "admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const itemsResult = await pool.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.img_url, p.weight
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    order.items = itemsResult.rows;

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
});

module.exports = router;
