import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { ToastContainer, toast } from "react-toastify";

export default function ProductCard({ name, price, weight, url }) {
  const { cart, setCart } = useContext(CartContext);
  const [activeComponent, setActiveComponent] = useState(0);
  const [qty, setQty] = useState(0);
  const [lastToastTime, setLastToastTime] = useState(0);


  const buttonControls = [
    <button
      type="submit"
      onClick={addToCart}
      className="border-2 border-none px-2 py-1 bg-blue-800 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-900
          transition delay-150 duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110"
    >
      Add to Cart
    </button>,


<div className="flex gap-3">
  <input
    type="number"
    min="0"
    max="50"
    value={qty}
    onChange={handleQtyChange}
    className="w-16 px-2 py-1 border rounded-md text-center"
  />
</div>

]; 

function handleQtyChange(e) {
  const value = parseInt(e.target.value, 10);

  if (!isNaN(value) && value >= 0 && value <= 500) {
    setQty(value);

    const now = Date.now();
    if (now - lastToastTime > 5000) {
      toast(`${name} added to cart!`);
      setLastToastTime(now);
    }

    setCart(
      cart.map((p) => {
        if (p.name === name) {
          return { ...p, qty: value };
        } else {
          return p;
        }
      })
    );
  }
}


  function addToCart() {
    let product = cart.find((p) => p.name === name);
    toast(`${name} added to cart!`);
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
      setCart([
        ...cart,
        { name: name, qty: 1, price: price, weight: weight, url: url },
      ]);
    }

    setQty(1);
    setActiveComponent(1);
  }

  return (
    <div className="flex gap-5 10 items-center justify-center p-5 rounded-lg hover:bg-gray-200 w-80">
      <Link to={`${name}`}>
        <div className="w-32 h-32 flex items-center justify-center">
          <img className="w-full h-full object-contain" src={url} alt={name} />
        </div>
      </Link>

      <div className="flex items-center justify-center flex-col gap-5">
        <p className="font-semibold">{name}</p>
        <p className="whitespace-nowrap">
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
