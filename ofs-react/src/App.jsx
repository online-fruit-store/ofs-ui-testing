import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col grow min-h-screen">
      <Header className="flex gap-10 p-5 shadow-sm bg-cyan-500 shadow-cyan-500/50" />
      <Outlet />
      <Footer className="" />
    </div>
  );
}

export default App;
