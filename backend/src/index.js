require("dotenv").config();
const pool = require("./db/pool");
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { placeOrder } = require("./controllers/orderController");

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

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

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
    const { firstName, lastName, email, password } = req.body;
    await pool.query(
      "INSERT INTO userspace (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, 'customer')",
      [firstName, lastName, email, password]
    );
    res.redirect("http://localhost:5173/");
  } catch (err) {
    return next(err);
  }
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, weight, stock } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET name = $1,
          price = $2,
          weight = $3,
          stock = $4
      WHERE id = $5
      RETURNING *;
      `,
      [name, price, weight, stock, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5173/");
  });
});

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

app.post("/api/order", placeOrder);

app.get("/", (_req, res) => {
  res.send("Backend server is running.");
});

app.listen(process.env.PORT, () =>
  console.log(`Example app is listening on port ${process.env.PORT}`)
);

const mergeCarts = (serverCart, localCart) => {
  const merged = [...(serverCart || [])];
  (localCart || []).forEach((localItem) => {
    const existing = merged.find((item) => item.id === localItem.id);
    if (existing) {
      existing.qty += localItem.qty;
    } else {
      merged.push(localItem);
    }
  });
  return merged;
};

app.get("/user/cart", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT cart FROM userspace WHERE id = $1",
      [req.user.id]
    );
    const cart = rows[0]?.cart || [];
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

app.post("/user/cart", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: "Cart must be an array" });
    }

    // Debug the cart data
    console.log("Received cart data:", JSON.stringify(cart));

    // Use parameterized query with explicit JSONB cast
    await pool.query("UPDATE userspace SET cart = $1::jsonb WHERE id = $2", [
      JSON.stringify(cart),
      req.user.id,
    ]);

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (err) {
    console.error("Error updating cart:", err);
    res
      .status(500)
      .json({ error: "Failed to save cart", details: err.message });
  }
});

app.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info.message });

      req.logIn(user, (err) => {
        if (err) return next(err);
        next();
      });
    })(req, res, next);
  },
  async (req, res) => {
    try {
      const localCart = req.body.cart || [];

      const { rows } = await pool.query(
        "SELECT cart FROM userspace WHERE id = $1",
        [req.user.id]
      );
      const serverCart = rows[0]?.cart || [];

      const mergedCart = mergeCarts(serverCart, localCart);

      await pool.query("UPDATE userspace SET cart = $1 WHERE id = $2", [
        JSON.stringify(mergedCart),
        req.user.id,
      ]);

      res.json({
        success: true,
        cart: mergedCart,
        user: req.user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process login" });
    }
  }
);

app.get("/logout", async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("http://localhost:5173/");
    });
  } catch (err) {
    next(err);
  }
});
