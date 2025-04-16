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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM userspace WHERE email = $1",
          [email]
        );
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM userspace WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, userName, email, password, password2 } =
      req.body;
    await pool.query(
      "INSERT INTO userspace (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
      [firstName, lastName, userName, email, password]
    );
    res.redirect("http://localhost:5173/");
  } catch (err) {
    return next(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/404",
  })
);

app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
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
