import React from "react";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  return (
    <nav className="flex flex-nowrap justify-start py-[2rem] px-[1rem]">
      <div className="container flex flex-nowrap items-center justify-between">
        <div className="mr-[16px]">ADMIN</div>
        <div className="header-content flex flex-auto gap-[1rem]">
          <ul className="flex flex-row gap-[1rem]">
            <li>
              <Link to="/">Customer Home</Link>
            </li>
            <li>
              <Link to="/Admin">Products</Link>
            </li>
            <li>
              <Link to="/Admin/Orders/">Orders</Link>
            </li>
            <li>
              <Link to="/Admin/Users/">Users</Link>
            </li>
          </ul>
          <p className="text-red-600 font-bold">
            Warning: Any changes made in this setting will affect the entire
            site.
          </p>
        </div>
      </div>
    </nav>
  );
}
