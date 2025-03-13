import logo from "../assets/spartans.png";
import Dropdown from "../components/Dropdown";
import { Link } from "react-router-dom";
export default function Header({ className }) {
  return (
    <div className={className}>
      <Link to="/">
        <div className="shrink flex items-center gap-5 grow">
          <img className="w-20" src={logo} alt="Spartan Logo" />
          <p className="text-3xl font-bold text-wrap text-white max-w-50">
            Spartan Food Store
          </p>
        </div>
      </Link>

      <div className="grow-8 flex items-center">
        <input
          className="border w-full p-2 bg-white rounded-lg"
          id="searchBox"
          type="text"
          placeholder="Search"
        />
      </div>

      <div className="grow-1 flex items-center">
        <ul className="flex">
          <li>
            <Dropdown text="Login" className="relative inline-block" />
          </li>
          <li>
            <Dropdown text="Shopping Cart" className="relative inline-block" />
          </li>
          <li>
            <Dropdown text="Checkout" className="relative inline-block" />
          </li>
        </ul>
      </div>
    </div>
  );
}
