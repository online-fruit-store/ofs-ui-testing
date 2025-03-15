const pool = require("./pool");

async function getAllProducts() {
  const { rows } = await pool.query("SELECT * FROM products");
  console.log(rows);
  return rows;
}

module.exports = {
  getAllProducts,
};
