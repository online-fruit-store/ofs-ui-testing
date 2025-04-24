import Header from "./components/Major/Header";
import LoggedInHeader from "./components/Major/LoggedInHeader";
import Footer from "./components/Major/Footer";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />
      {auth.loggedIn ? <LoggedInHeader /> : <Header />}
      <div className="flex pt-20 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
