import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export default function ProductCard({ name, price, url }) {
  const { cart, setCart } = useContext(CartContext);
  const [qty, setQty] = useState(1);
  function handleQtyChange(e) {
    setQty(e.target.value);
  }

  function addToCart(formData) {
    const qtyToAdd = Number(formData.get("qty"));
    let product = cart.find((p) => p.name === name);
    if (product) {
      setCart(
        cart.map((p) => {
          if (p.name === name) {
            return { ...p, qty: p.qty + qtyToAdd };
          } else {
            return p;
          }
        })
      );
    } else {
      setCart([...cart, { name: name, qty: qtyToAdd }]);
    }
    setQty(1);
  }

  return (
    <div className="flex gap-3 items-center justify-center p-5 rounded-lg hover:bg-gray-200">
      <Link to={`products/${name}`}>
        <div>
          <img className="w-32 h-32" src={url} />
        </div>
      </Link>

      <div className="flex items-center justify-center flex-col gap-5">
        <p className="font-semibold">{name}</p>
        <p>${price}</p>

        <form
          className="flex flex-col items-center justify-center gap-1"
          action={addToCart}
        >
          <label>Quantity:</label>
          <input
            name="qty"
            value={qty}
            onChange={handleQtyChange}
            min="1"
            max="50"
            type="number"
            className="flex w-10 bg-white border-gray-100 text-center"
          />

          <button
            type="submit"
            className="border-2 border-none p-1 bg-red-500 text-white rounded-lg border-blue-100"
          >
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
}
