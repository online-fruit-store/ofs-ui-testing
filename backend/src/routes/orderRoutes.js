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
      `SELECT o.* FROM orders o WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];
    const paymentResult = await pool.query(
      `SELECT transaction_id, last4 FROM payments
       WHERE created_at BETWEEN $1::timestamp - INTERVAL '1 minute' AND $1::timestamp + INTERVAL '1 minute'
       AND amount = $2
       ORDER BY created_at
       LIMIT 1`,
      [order.created_at, order.total]
    );

    if (paymentResult.rows.length > 0) {
      order.transaction_id = paymentResult.rows[0].transaction_id;
      order.last4 = paymentResult.rows[0].last4;
    }

    const itemsResult = await pool.query(
      `SELECT id, product_id, product_name as name, product_price, 
              quantity, price, img_url, weight
       FROM order_items
       WHERE order_id = $1`,
      [orderId]
    );

    order.items = itemsResult.rows;

    res.json({
      success: true,
      order: order,
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

router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Admin privileges required.",
      });
    }

    const {
      status,
      startDate,
      endDate,
      userId,
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    let query = `
      SELECT o.id, o.user_id, o.status, o.total, o.shipping_address, o.created_at,
             u.first_name, u.last_name, u.email
      FROM orders o
      LEFT JOIN userspace u ON o.user_id = u.id
      WHERE 1=1
    `;

    const queryParams = [];

    if (status) {
      queryParams.push(status);
      query += ` AND o.status = $${queryParams.length}`;
    }

    if (startDate) {
      queryParams.push(new Date(startDate));
      query += ` AND o.created_at >= $${queryParams.length}`;
    }

    if (endDate) {
      queryParams.push(new Date(endDate));
      query += ` AND o.created_at <= $${queryParams.length}`;
    }

    if (userId) {
      queryParams.push(parseInt(userId));
      query += ` AND o.user_id = $${queryParams.length}`;
    }

    const validSortColumns = ["id", "created_at", "total", "status"];
    const validSortOrders = ["ASC", "DESC"];

    const finalSortBy = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    query += ` ORDER BY o.${finalSortBy} ${finalSortOrder}`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryParams.push(parseInt(limit));
    queryParams.push(offset);
    query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

    const result = await pool.query(query, queryParams);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM orders o WHERE 1=1 ${
        status ? " AND o.status = $1" : ""
      } ${startDate ? ` AND o.created_at >= $${status ? 2 : 1}` : ""} ${
        endDate
          ? ` AND o.created_at <= $${
              status && startDate ? 3 : status || startDate ? 2 : 1
            }`
          : ""
      } ${
        userId
          ? ` AND o.user_id = $${
              [status, startDate, endDate].filter(Boolean).length + 1
            }`
          : ""
      }`,
      [status, startDate, endDate, userId].filter(Boolean)
    );

    const totalOrders = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    res.json({
      success: true,
      orders: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalOrders,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

router.put("/:orderId/status", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Admin privileges required.",
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
});
module.exports = router;
