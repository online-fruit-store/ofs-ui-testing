const pool = require('../db/pool');
const queries = require('../db/query');
async function placeOrder(req, res) {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Missing product_id or quantity' });
  }
  try {
    const client = await pool.connect();
    // Check stock
    const stockResult = await client.query('SELECT stock FROM products WHERE id = $1', [product_id]);
    if (stockResult.rowCount === 0) {
      client.release();
      return res.status(404).json({ error: 'Product not found' });
    }
    const currentStock = stockResult.rows[0].stock;
    if (currentStock < quantity) {
      client.release();
      return res.status(400).json({ error: 'Not enough stock available' });
    }
    // Reduce stock
    await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [quantity, product_id]);
    // Record order
    await client.query('INSERT INTO orders (product_id, quantity) VALUES ($1, $2)', [product_id, quantity]);
    client.release();
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports = { placeOrder };
