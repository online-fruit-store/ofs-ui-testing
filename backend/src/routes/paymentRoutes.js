const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
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

    console.log("Processing payment with cart:", JSON.stringify(cart, null, 2));
    console.log("User ID from request:", userId);

    let parsedUserId = null;
    if (userId !== null && userId !== undefined && userId !== "") {
      const tempId = parseInt(userId);
      if (!isNaN(tempId)) {
        parsedUserId = tempId;
        console.log("Parsed user ID:", parsedUserId);
      }
    }

    await client.query("BEGIN");

    const paymentResult = await client.query(
      "INSERT INTO payments (transaction_id, amount, last4) VALUES ($1, $2, $3) RETURNING *",
      [transactionId, amount, last4]
    );

    const shippingAddress =
      billingAddress && city && state && zipCode
        ? `${billingAddress}, ${city}, ${state} ${zipCode}`
        : null;

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, status, total, shipping_address) VALUES ($1, $2, $3, $4) RETURNING *",
      [parsedUserId, "pending", parseFloat(amount), shippingAddress]
    );

    const order = orderResult.rows[0];
    let insufficientStockItems = [];
    let productCache = {};

    if (cart && Array.isArray(cart) && cart.length > 0) {
      for (const item of cart) {
        let productId = null;
        let productName = item.name;
        const quantity = parseInt(item.qty) || 1;

        if (item.id && !isNaN(parseInt(item.id))) {
          productId = parseInt(item.id);

          const productResult = await client.query(
            "SELECT id, name, price, stock, img_url, weight FROM products WHERE id = $1",
            [productId]
          );

          if (productResult.rows.length > 0) {
            const product = productResult.rows[0];
            productCache[productId] = product;

            if (parseInt(product.stock) < quantity) {
              insufficientStockItems.push({
                id: product.id,
                name: product.name,
                requested: quantity,
                available: product.stock,
              });
            }
          } else {
            console.warn(
              `Product with ID ${productId} not found, trying by name...`
            );
            productId = null;
          }
        }

        if (!productId && productName) {
          const productResult = await client.query(
            "SELECT id, name, price, stock, img_url, weight FROM products WHERE name = $1",
            [productName]
          );

          if (productResult.rows.length > 0) {
            const product = productResult.rows[0];
            productId = product.id;
            productCache[productId] = product;

            if (parseInt(product.stock) < quantity) {
              insufficientStockItems.push({
                id: product.id,
                name: product.name,
                requested: quantity,
                available: product.stock,
              });
            }
          } else {
            console.warn(`Product not found: ${productName}`);
          }
        }
      }
    }

    if (insufficientStockItems.length > 0) {
      console.log("Insufficient stock for items:", insufficientStockItems);
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Insufficient stock for some items",
        insufficientItems: insufficientStockItems,
      });
    }

    if (cart && Array.isArray(cart) && cart.length > 0) {
      for (const item of cart) {
        let productId = null;
        let product = null;
        const quantity = parseInt(item.qty) || 1;

        if (item.id && !isNaN(parseInt(item.id))) {
          productId = parseInt(item.id);
          product = productCache[productId];
        }

        if (!product && item.name) {
          const productResult = await client.query(
            "SELECT id, name, price, stock, img_url, weight FROM products WHERE name = $1",
            [item.name]
          );

          if (productResult.rows.length > 0) {
            product = productResult.rows[0];
            productId = product.id;
          }
        }

        if (!product || !productId) {
          console.warn(
            `Could not find product for cart item: ${JSON.stringify(item)}`
          );
          continue;
        }
        await client.query(
          "UPDATE products SET stock = stock - $1 WHERE id = $2",
          [quantity, productId]
        );
        await client.query(
          `INSERT INTO order_items 
           (order_id, product_id, product_name, product_price, quantity, price, img_url, weight) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            order.id,
            productId,
            product.name,
            parseFloat(product.price),
            quantity,
            parseFloat(item.price || product.price),
            product.img_url || item.url,
            parseFloat(product.weight || item.weight || 0),
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Payment processed and order created successfully",
      payment: paymentResult.rows[0],
      orderId: order.id,
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
