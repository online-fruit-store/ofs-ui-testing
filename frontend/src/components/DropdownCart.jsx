import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

function Dropdown({ text, className, link }) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useContext(CartContext);

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

      {isOpen && cart.length > 0 && (
        <ul className="absolute -left-8 mt-0 w-48 bg-white border rounded shadow-lg z-[60]">
          {cart.map((product, index) => (
            <li
              key={`${product.id || index}`}
              className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
            >
              <div>
                {"("}
                {product.qty}
                {") "} {product.name}
              </div>
              <div>${Number(product.price).toFixed(2)}</div>
            </li>
          ))}
          <div className="p-3">
            <li className="border-b"></li>
          </div>
          <li className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
            <div>Subtotal:</div>
            <div>
              $
              {cart
                .reduce(
                  (total, product) =>
                    total + Number(product.price) * product.qty,
                  0
                )
                .toFixed(2)}
            </div>
          </li>
          <li className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
            <div>Total Items:</div>
            <div>{cart.reduce((total, product) => total + product.qty, 0)}</div>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
