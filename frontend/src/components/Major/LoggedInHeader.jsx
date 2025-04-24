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
    <div className="flex gap-10 p-1 shadow-sm bg-red-500 fixed w-full">
      <Link to="/">
        <div className="flex items-center gap-5 hover:ring hover:ring-white rounded-sm">
          <img className="w-20" src={logo} alt="Spartan Logo" />
          <p className="text-2xl font-bold text-white">Spartan Food Store</p>
        </div>
      </Link>

      <div className="flex-auto flex items-center">
        <SearchBar />
      </div>

      <div className="flex items-center">
        <ul className="flex">
          <li>
            <Dropdown
              text={"Welcome " + auth.user.first_name}
              className="relative inline-block"
            />
          </li>
          <li>
            <Dropdown
              text="Products"
              className="relative inline-block"
              link={"/products"}
            />
          </li>
          <li>
            <DropdownCart
              link={"/Checkout"}
              text="Cart"
              className="relative inline-block"
            />
          </li>
          <li>
            <Dropdown
              link={"/Logout"}
              text="Logout"
              className="relative inline-block"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
