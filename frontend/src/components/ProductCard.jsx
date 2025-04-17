import AddToCart from "./AddToCart";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export default function ProductCard({ name, price, weight, url }) {
  const { cart, setCart } = useContext(CartContext);
  const [activeComponent, setActiveComponent] = useState(0);
  const [qty, setQty] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const buttonControls = [
    <form
      className="flex flex-col items-center justify-center gap-1"
      action={addToCart}
    >
      <button
        type="submit"
        className="border-2 border-none px-2 py-1 bg-red-500 text-white text-sm rounded-lg cursor-pointer hover:bg-red-600
          transition delay-150 duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110"
      >
        Add to Cart
      </button>
    </form>,
    <div className="flex gap-3">
      <button
        onClick={decreaseQty}
        className="border-2 border-none px-2 py-1 bg-red-500 text-white text-sm rounded-lg cursor-pointer hover:bg-red-600"
      >
        -
      </button>
      <div className="bg-white border rounded-lg px-2">{qty}</div>
      <button
        className="border-2 border-none px-2 py-1 bg-red-500 text-white text-sm rounded-lg cursor-pointer hover:bg-red-600"
        onClick={increaseQty}
      >
        +
      </button>
    </div>,
  ];

  function decreaseQty() {
    if (qty > 1) {
      setQty(qty - 1);
      setCart(
        cart.map((p) => {
          if (p.name === name) {
            return { ...p, qty: p.qty - 1 };
          } else {
            return p;
          }
        })
      );
    } else {
      setActiveComponent(0);
    }
  }

  function increaseQty() {
    if (qty < 50) {
      setQty(qty + 1);
      setCart(
        cart.map((p) => {
          if (p.name === name) {
            return { ...p, qty: p.qty + 1 };
          } else {
            return p;
          }
        })
      );
    }
  }

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
      setCart([...cart, { name: name, qty: 1, price: price, weight: weight, url: url }]);
    }
    setQty(1);
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
        <p>
         ${price}
          {weight != null && (
            <span className="text-gray-500 text-sm"> / {weight} lbs</span>
          )}
        </p>
        {activeComponent ? buttonControls[1] : buttonControls[0]}
      </div>
    </div>
  );
}
