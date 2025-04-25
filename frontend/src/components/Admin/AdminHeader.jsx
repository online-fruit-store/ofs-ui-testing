import React from "react";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  return (
    <nav className="flex flex-nowrap justify-start py-[2rem] px-[1rem]">
      <div className="container flex flex-nowrap items-center justify-between">
        <Link to="http://localhost:5173/Admin" className="mr-[16px]">
          ADMIN
        </Link>
        <div className="header-content flex flex-auto gap-[1rem]">
          <ul className="flex flex-row gap-[1rem]">
            <li>Home</li>
            <li>Categories</li>
            <li>Products</li>
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
