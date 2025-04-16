import { createContext, useEffect, useState } from "react";
const AuthContext = createContext({ auth: [], setAuth: () => {} });

export default function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({ loggedIn: false, user: null });
  useEffect(() => {
    fetch("http://localhost:3000/auth/status", {
      credentials: "include",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => setAuth(data));
  }, []);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
