import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";

export default function Logout() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { setCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:3000/logout", {
      credentials: "include",
      mode: "cors",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Logout failed");
        return res.json().catch(() => ({}));
      })
      .then((data) => {
        setAuth(data);
        setCart([]);
        localStorage.removeItem("cart"); 
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
        setAuth({ loggedIn: false, user: null });
        setCart([]); 
        localStorage.removeItem("cart");
        navigate("/");
      });
  }, [navigate, setAuth, setCart]);

  return <div></div>;
}