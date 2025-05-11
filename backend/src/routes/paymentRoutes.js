const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const { transactionId, amount, last4, cart, userId = null } = req.body;

    await client.query("BEGIN");

    const paymentResult = await client.query(
      "INSERT INTO payments (transaction_id, amount, last4) VALUES ($1, $2, $3) RETURNING *",
      [transactionId, amount, last4]
    );

    const shippingAddress = req.body.billingAddress
      ? `${req.body.billingAddress}, ${req.body.city}, ${req.body.state} ${req.body.zipCode}`
      : null;

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, status, total, shipping_address, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [userId, "completed", parseFloat(amount), shippingAddress, new Date()]
    );

    const orderId = orderResult.rows[0].id;

    if (cart && Array.isArray(cart) && cart.length > 0) {
      for (const item of cart) {
        await client.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [orderId, item.id, item.qty || 1, item.price]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Payment processed and order created successfully",
      payment: paymentResult.rows[0],
      orderId,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

module.exports = router;
