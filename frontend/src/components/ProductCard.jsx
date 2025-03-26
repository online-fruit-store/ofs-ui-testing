import AddToCart from "./AddToCart";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export default function ProductCard({ name, price, url }) {
  const { cart, setCart } = useContext(CartContext);
  const [activeComponent, setActiveComponent] = useState(0);
  const buttonControls = [
    <form
      className="flex flex-col items-center justify-center gap-1"
      action={addToCart}
    >
      <button
        type="submit"
        className="border-2 border-none px-2 py-1 bg-red-500 text-white text-sm rounded-lg border-blue-100 cursor-pointer hover:bg-red-600
          transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
      >
        Add to Cart
      </button>
    </form>,
  ];

  function addToCart() {
    let product = cart.find((p) => p.name === name);
    if (product) {
      setCart(
        cart.map((p) => {
          if (p.name === name) {
            return { ...p, qty: p.qty + 1 };
          } else {
            return p;
          }
        })
      );
    } else {
      setCart([...cart, { name: name, qty: 1, price: price, url: url }]);
    }
    setActiveComponent(1);
  }

  return (
    <div className="flex gap-5 10 items-center justify-center p-5 rounded-lg hover:bg-gray-200 w-80">
      <Link to={`${name}`}>
        <div>
          <img className="w-32 h-32" src={url} />
        </div>
      </Link>

      <div className="flex items-center justify-center flex-col gap-5">
        <p className="font-semibold">{name}</p>
        <p>${price}</p>
        {activeComponent ? buttonControls[1] : buttonControls[0]}
      </div>
    </div>
  );
}
