import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
export default function Logout() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
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
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
        setAuth({ loggedIn: false, user: null });
        navigate("/");
      });
  }, [navigate, setAuth]);

  return <div></div>;
}
