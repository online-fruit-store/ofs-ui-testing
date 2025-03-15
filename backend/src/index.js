require("dotenv").config();
const express = require("express");
const db = require("./db/query");

const app = express();
const example = [{ name: "Ivan", ethnicity: "Chicano", money: 3.99 }];
app.get("/", async (req, res) => {
  const products = await db.getAllProducts();
  res.json(products);
});

app.get("/ivan", (req, res) => {
  res.json(example);
});

app.listen(process.env.PORT, () =>
  console.log(`Example app is listening on port ${process.env.PORT}`)
);
