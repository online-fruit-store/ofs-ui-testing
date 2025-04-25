import { Outlet } from "react-router-dom";
import AdminHeader from "./components/Admin/AdminHeader";

function AdminApp() {
  return (
    <div className="grow">
      <AdminHeader />
      <Outlet />
    </div>
  );
}

export default AdminApp;
