import HeaderAdmin from "./components/HeaderAdmin";
import { Outlet } from "react-router-dom";

function AdminApp() {
  return (
    <div className="flex flex-col grow min-h-screen">
      <HeaderAdmin />
      <Outlet />
    </div>
  );
}

export default AdminApp;
