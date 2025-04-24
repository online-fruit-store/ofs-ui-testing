import { Outlet } from "react-router-dom";

function AdminApp() {
  return (
    <div className="grow">
      <Outlet />
    </div>
  );
}

export default AdminApp;
