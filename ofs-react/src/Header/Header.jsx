import logo from "../assets/spartans.png";
import Dropdown from "../components/Dropdown";
export default function Header({ className }) {
  return (
    <div className={className}>
      {/* Left Section: Logo and Title */}
      <div className="shrink flex items-center gap-1 grow">
        <img className="w-20" src={logo} alt="Spartan Logo" />
        <p className="text-3xl font-bold text-wrap max-w-30">
          Spartan Food Store
        </p>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="grow-8 flex items-center">
        <input
          className="border w-full p-2"
          id="searchBox"
          type="text"
          placeholder="Search"
        />
      </div>

      {/* Right Section: Dropdowns */}
      <div className="grow-1 flex items-center">
        <ul className="flex">
          <li>
            <Dropdown text="Track Deliveries" />
          </li>
          <li>
            <Dropdown text="Shopping Cart" />
          </li>
          <li>
            <Dropdown text="Checkout" />
          </li>
        </ul>
      </div>
    </div>
  );
}
