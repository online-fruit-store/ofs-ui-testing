import { useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
export default function Logout() {
  const { setAuth } = useContext(AuthContext);
  useEffect(() => {
    fetch("http://localhost:3000/logout", {
      credentials: "include",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => setAuth(data));
  }, []);
  return <div></div>;
}
