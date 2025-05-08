import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const CartContext = createContext({ cart: [], setCart: () => {} });

export default function CartContextProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    console.log("Cart updated", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    
    if (auth.loggedIn) {
      fetch("http://localhost:3000/user/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
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