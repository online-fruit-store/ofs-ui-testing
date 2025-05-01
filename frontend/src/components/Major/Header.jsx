import { useState } from 'react';
import logo from "../../assets/spartans.png";
import Dropdown from "../Dropdown";
import DropdownCart from "../DropdownCart";
import SearchBar from "../SearchBar";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-1 shadow-sm bg-red-500 fixed w-full z-50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <Link to="/">
            <div className="flex items-center gap-5 hover:ring hover:ring-white rounded-sm">
              <img className="w-20" src={logo} alt="Spartan Logo" />
              <p className="hidden sm:block text-2xl font-bold text-white">Spartan Food Store</p>
            </div>
          </Link>
        </div>

        

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:flex flex-auto mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center">
            
            <button className="md:hidden text-white p-2 mr-2" onClick={() => setShowSearch(!showSearch)}>
              <Search size={24} />
            </button>

            <ul className="flex">
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
              <li className="whitespace-nowrap">
                <Dropdown
                  text="Login / Register"
                  className="relative inline-block"
                  link={"/Auth"}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {showSearch && (
        <div className="md:hidden px-2 pb-2">
          <SearchBar />
        </div>
      )}
    </div>
  );
}