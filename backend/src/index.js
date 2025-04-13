require("dotenv").config();
const express = require("express");
const db = require("./db/query");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/products", async (req, res) => {
  let products = [];
  const { category } = req.query;
  if (category) {
    products = await db.getFilteredProducts(category);
  } else {
    products = await db.getAllProducts();
  }
  res.json(products);
});

app.get("/products/:productName", async (req, res) => {
  const { productName } = req.params;
  const product = await db.getProduct(productName);
  res.json(product);
});

app.get("/categories", async (req, res) => {
  const categories = await db.getAllCategories();
  res.json(categories);
});

app.get("/users", async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
});

app.get("/", (_req, res) => {
  res.send("Backend server is running.");
});

app.listen(process.env.PORT, () =>
  console.log(`Example app is listening on port ${process.env.PORT}`)
);
