import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col grow min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
