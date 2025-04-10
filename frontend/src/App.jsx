import Header from "./components/Major/Header";
import Footer from "./components/Major/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col grow min-h-screen relative">
      <Header />
      <div className="flex pt-20 grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
