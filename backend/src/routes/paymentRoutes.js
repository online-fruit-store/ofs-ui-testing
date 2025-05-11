const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// routes/paymentRoutes.js
// POST endpoint to save payment and create order
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    // Extract payment data from request body
    const {
      transactionId,
      amount,
      last4,
      cart,
      userId = null,
      billingAddress,
      city,
      state,
      zipCode,
    } = req.body;

    console.log("Cart items:", JSON.stringify(cart, null, 2));

    // Begin transaction
    await client.query("BEGIN");

    // Insert the payment record
    const paymentResult = await client.query(
      "INSERT INTO payments (transaction_id, amount, last4) VALUES ($1, $2, $3) RETURNING *",
      [transactionId, amount, last4]
    );

    // Create the shipping address
    const shippingAddress =
      billingAddress && city && state && zipCode
        ? `${billingAddress}, ${city}, ${state} ${zipCode}`
        : null;

    // Create a new order
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, status, total, shipping_address) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, "completed", parseFloat(amount), shippingAddress]
    );

    const order = orderResult.rows[0];

    // Insert order items with product data
    if (cart && Array.isArray(cart) && cart.length > 0) {
      for (const item of cart) {
        console.log("Processing cart item:", item);

        // Safely parse the product ID
        let productId = null;
        if (item.id !== undefined && item.id !== null) {
          // Try to convert id to a number if it's not already
          const parsedId = parseInt(item.id);
          if (!isNaN(parsedId)) {
            productId = parsedId;
          }
        }

        // Log the product ID for debugging
        console.log(
          `Item: ${item.name}, ID: ${item.id}, Parsed ID: ${productId}`
        );

        // If no valid product ID, use null (will set to null in the database due to foreign key)
        let productData = {
          name: item.name || "Unknown Product",
          price: parseFloat(item.price) || 0,
          img_url: item.url || item.img_url || null,
          weight: parseFloat(item.weight) || 0,
        };

        // Only look up product data if we have a valid product ID
        if (productId !== null) {
          try {
            const productResult = await client.query(
              "SELECT name, price, img_url, weight FROM products WHERE id = $1",
              [productId]
            );

            if (productResult.rows.length > 0) {
              productData = {
                ...productData,
                ...productResult.rows[0],
              };
            }
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
          }
        }

        // Insert order item with denormalized product data
        await client.query(
          `INSERT INTO order_items 
           (order_id, product_id, product_name, product_price, quantity, price, img_url, weight) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            order.id,
            productId, // Can be null
            productData.name,
            parseFloat(productData.price),
            parseInt(item.qty) || 1,
            parseFloat(item.price) || 0,
            productData.img_url,
            parseFloat(productData.weight) || 0,
          ]
        );
      }
    }

    // Commit transaction
    await client.query("COMMIT");

    // Send successful response
    res.status(201).json({
      success: true,
      message: "Payment processed and order created successfully",
      payment: paymentResult.rows[0],
      orderId: order.id,
    });
  } catch (error) {
    // Rollback transaction on error
    await client.query("ROLLBACK");

    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message,
    });
  } finally {
    // Release the client back to the pool
    client.release();
  }
});

module.exports = router;
