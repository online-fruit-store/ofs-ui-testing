const pool = require("./pool");

async function getAllProducts() {
  const { rows } = await pool.query("SELECT * FROM products");
  return rows;
}
async function getAllCategories() {
  const { rows } = await pool.query("SELECT DISTINCT category FROM products");
  return rows;
}

async function getProduct(productName) {
  const { rows } = await pool.query("SELECT * FROM products WHERE name = $1", [
    productName,
  ]);
  return rows.length > 0 ? rows[0] : null;
}
module.exports = {
  getAllProducts,
  getAllCategories,
  getProduct,
};
