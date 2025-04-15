require("dotenv").config();
const pool = require("./db/pool");
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("./db/query");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.post("/register", async (req, res, next) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    await pool.query(
      "INSERT INTO userspace (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, email, password]
    );
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

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
