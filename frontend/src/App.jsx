import Header from "./components/Major/Header";
import LoggedInHeader from "./components/Major/LoggedInHeader";
import Footer from "./components/Major/Footer";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { auth } = useContext(AuthContext);
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
