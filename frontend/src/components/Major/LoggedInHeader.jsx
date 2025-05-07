import logo from "../../assets/spartans.png";
import Dropdown from "../Dropdown";
import DropdownCart from "../DropdownCart";
import SearchBar from "../SearchBar";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function LoggedInHeader() {
  const { auth } = useContext(AuthContext);
  return (
    <div className="flex flex-col gap-2 p-1 shadow-lg shadow-blue-200 fixed w-full z-50 bg-white">
      <div className="flex items-center justify-between gap-4 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
        <div className="flex-shrink-0">
          <Link to="/">
            <div className="flex items-center gap-5 hover:ring hover:ring-white rounded-sm">
              <img className="w-15" src={logo} alt="Spartan Logo" />
              <p className="hidden sm:block text-2xl font-bold text-black">
                Spartan Food Store
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center">
            <ul className="flex">
              <li className="pr-1">
                <Dropdown
                  text={"Welcome " + auth.user.first_name}
                  className="relative inline-block border-none bg-blue-800 hover:bg-blue-900 rounded-full p-0"
                  listItems={
                    auth.user.role === "admin"
                      ? [<Link to="/Admin">Admin Panel</Link>]
                      : []
                  }
                />
              </li>
              <li className="pr-1">
                <Dropdown
                  text="Products"
                  className="relative inline-block border-none bg-blue-800 hover:bg-blue-900 rounded-full p-0"
                  link={"/products"}
                />
              </li>
              <li className="pr-1">
                <DropdownCart
                  link={"/Checkout"}
                  text="Cart"
                  className="relative inline-block border-none bg-blue-800 hover:bg-blue-900 rounded-full p-0"
                />
              </li>
              <li className="whitespace-nowrap">
                <Dropdown
                  text="Logout"
                  className="relative inline-block border-none bg-blue-800 hover:bg-blue-900 rounded-full p-0"
                  link={"/Logout"}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pb-2">
        <SearchBar />
      </div>
    </div>
  );
}
