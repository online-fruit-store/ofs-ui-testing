import Header from "./components/Major/Header";
import LoggedInHeader from "./components/Major/LoggedInHeader";
import Footer from "./components/Major/Footer";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
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
    <div className="flex flex-col grow min-h-screen relative">
      {auth.loggedIn ? <LoggedInHeader /> : <Header />}
      <div className="flex pt-20 grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
