import logo from "../../assets/spartans.png";
import Dropdown from "../Dropdown";
import DropdownCart from "../DropdownCart";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex gap-10 p-1 shadow-sm bg-red-500 shadow-red-500/50 ">
      <Link to="/">
        <div className="flex items-center gap-5 hover:ring hover:ring-white rounded-sm">
          <img className="w-20" src={logo} alt="Spartan Logo" />
          <p className="text-2xl font-bold text-white">Spartan Food Store</p>
        </div>
      </Link>

      <div className="grow-7 flex items-center">
        <input
          className="p-2 w-full bg-white rounded-sm"
          id="searchBox"
          type="text"
          placeholder="Search"
        />
      </div>

      <div className="grow flex items-center">
        <ul className="flex">
          <li>
            <Dropdown
              text="Products"
              className="relative inline-block"
              link={"/products"}
            />
          </li>
          <li>
            <Dropdown
              text="Login"
              className="relative inline-block"
              link={"/Auth"}
            />
          </li>
          <li>
            <DropdownCart text="Cart" className="relative inline-block" />
          </li>
        </ul>
      </div>
    </div>
  );
}
