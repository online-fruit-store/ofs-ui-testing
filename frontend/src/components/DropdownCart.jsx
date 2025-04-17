import { useState } from "react";
import { Link } from "react-router-dom";
function Dropdown({ text, className, link }) {
  const [isOpen, setIsOpen] = useState(false);

  const storedCart = localStorage.getItem("cart");

  const cart = storedCart ? JSON.parse(storedCart) : [];
  return (
    <div
      className={className}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link to={link}>
        <button className="px-4 py-2 font-bold text-white rounded hover:ring cursor-pointer">
          {text}
        </button>
      </Link>

      {isOpen && (
        <ul className="absolute -left-8 mt-0 w-48 bg-white border rounded shadow-lg">
          {cart.map((product) => {
            return (
              <li className="px-4 py-2 hover:bg-gray-100">
                {product.name} {product.qty}
              </li>
            );
          })}
          <li className="px-4 py-2 hover:bg-gray-100 flex">
            <div>
              Total Items:{" "}
              {cart.reduce((total, product) => total + product.qty, 0)}
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
