import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const CartContext = createContext({ cart: [], setCart: () => {} });

export default function CartContextProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync with server when logged in
  useEffect(() => {
    if (auth.loggedIn) {
      // Fetch the cart from server when logged in
      fetch("http://localhost:3000/user/cart", {
        credentials: "include",
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch cart");
        })
        .then((data) => {
          if (data.cart && Array.isArray(data.cart)) {
            // Only update state if server cart is different
            if (JSON.stringify(data.cart) !== JSON.stringify(cart)) {
              setCart(data.cart);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching cart:", error);
        });
    }
  }, [auth.loggedIn]); // Only run when login state changes

  // Save cart to localStorage and server when cart changes
  useEffect(() => {
    console.log("Cart updated", cart);
    localStorage.setItem("cart", JSON.stringify(cart));

    if (auth.loggedIn) {
      fetch("http://localhost:3000/user/cart", {
        method: "POST",
        body: JSON.stringify({ cart }), // Properly format as { cart: [...] }
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Cart saved to server successfully!");
            return response.json();
          }
          throw new Error(`Failed to save cart: ${response.status}`);
        })
        .catch((error) => {
          console.error("Error saving cart:", error);
        });
    }
  }, [cart, auth.loggedIn]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
