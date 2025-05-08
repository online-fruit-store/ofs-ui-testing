import { createContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";

const AuthContext = createContext({ auth: [], setAuth: () => {} });

export default function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({ loggedIn: false, user: null });

  useEffect(() => {
    fetch("http://localhost:3000/auth/status", {
      credentials: "include",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          fetch("http://localhost:3000/user/cart", {
            credentials: "include",
            mode: "cors",
          })
            .then((res) => res.json())
            .then((cartData) => {
              const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
              const mergedCart = mergeCarts(cartData, localCart);
              localStorage.setItem("cart", JSON.stringify(mergedCart));
              setAuth(data); 
            })
            .catch(() => {
              setAuth(data); 
            });
        } else {
          setAuth(data);
        }
      });
  }, []);

  const mergeCarts = (serverCart, localCart) => {
    const merged = [...serverCart];
    localCart.forEach((localItem) => {
      const existing = merged.find((item) => item.id === localItem.id);
      if (existing) {
        existing.qty += localItem.qty;
      } else {
        merged.push(localItem);
      }
    });
    return merged;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };