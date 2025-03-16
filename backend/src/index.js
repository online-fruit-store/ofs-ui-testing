require("dotenv").config();
const express = require("express");
const db = require("./db/query");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/products", async (req, res) => {
  const products = await db.getAllProducts();
  res.json(products);
});

app.get("/categories", async (req, res) => {
  const categories = await db.getAllCategories();
  res.json(categories);
});

app.listen(process.env.PORT, () =>
  console.log(`Example app is listening on port ${process.env.PORT}`)
);
