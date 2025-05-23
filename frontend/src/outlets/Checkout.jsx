import { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from "../components/Map";

function getFormattedDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const options = { weekday: "long", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const tax = subtotal * 0.1025;
  const totalWeight = cart.reduce((sum, p) => sum + p.weight * p.qty, 0);
  const deliveryFee = totalWeight < 20 ? 0 : 5;
  const orderTotal = subtotal + tax + deliveryFee;

  function removeFromCart(product) {
    setCart(cart.filter((p) => p.name !== product.name));
  }

  function adjustQty(p, adjQty) {
    setCart(
      cart.map((product) => {
        if (product.name === p.name) {
          return { ...p, qty: adjQty };
        } else {
          return product;
        }
      })
    );
  }

  const deliverySlots = [
    {
      id: "today",
      label: `Today (${getFormattedDate(0)})`,
      costTag: "Same Day Delivery with FRESHNESS 100🔥🔥🔥🔥",
    },
  ];

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col lg:flex-row gap-6 p-8 mt-15">
      <div className="w-full lg:w-96 bg-white rounded-md shadow-md p-6 mb-6 lg:mb-0">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Choose Your Delivery Option
        </h2>

        <form>
          {deliverySlots.map((opt) => (
            <label
              key={opt.id}
              className="flex items-start p-4 border-b cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="delivery"
                value={opt.id}
                checked={deliveryOption === opt.id}
                onChange={() => setDeliveryOption(opt.id)}
                className="mt-1 mr-4"
              />
              <div>
                <div className="flex flex-col">
                  <span className="font-medium">{opt.label}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    {opt.costTag}
                  </span>
                </div>
              </div>
            </label>
          ))}

          <label className="flex items-start p-4 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="delivery"
              value="pickup"
              checked={deliveryOption === "pickup"}
              onChange={() => setDeliveryOption("pickup")}
              className="mt-1 mr-4"
            />
            <div>
              <span className="font-medium">Pickup at Store</span>
              <p className="text-sm text-gray-500 mt-1">
                Select your pickup location
              </p>
            </div>
          </label>
        </form>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-md shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Review Items
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <ul className="space-y-6">
              {cart.map((p) => (
                <li key={p.id} className="flex border-b pb-4">
                  <div className="w-30 h-30 flex items-center justify-center">
                    <img
                      src={p.url}
                      alt={p.imageAlt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.color}</p>
                    <p className="text-sm text-gray-600 mt-1 flex flex-row gap-2 items-center">
                      <label>Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={p.qty}
                        onChange={(e) => {
                          const newQty = Math.max(
                            1,
                            Math.floor(Number(e.target.value))
                          );
                          adjustQty(p, newQty);
                        }}
                        className="border rounded-sm w-16 px-2 py-1"
                        onKeyDown={(e) => {
                          if (e.key === "." || e.key === "-" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Weight: {(p.weight * p.qty).toFixed(2)} lbs
                    </p>
                    <div className="flex justify-between">
                      <p className="mt-1 text-md font-medium text-gray-900">
                        ${(p.price * p.qty).toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(p)}
                        className="font-medium text-red-600 hover:text-red-500 hover:cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col items-start gap-6">
          <div className="w-full lg:w-100 bg-white rounded-md shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Order Summary
            </h2>
            <ul className="space-y-3 text-gray-700 text-base">
              <li className="flex justify-between">
                <span>Items subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping:</span>
                <span>{deliveryFee === 0 ? "Free under 20 lbs" : "$5.00"}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Total weight:</span>
                <span>{totalWeight.toFixed(2)} lbs</span>
              </li>
              <li className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Order total:</span>
                <span>${orderTotal.toFixed(2)}</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => {
                navigate("/Checkout/Processing", {
                  state: {
                    cartItems: cart.map((item) => ({
                      ...item,
                      quantity: item.qty,
                    })),
                    total: orderTotal,
                  },
                });
              }}
              disabled={cart.length === 0 || !deliveryOption}
              className={`mt-6 w-full text-white font-bold py-3 rounded-md shadow-md ${
                cart.length === 0 || !deliveryOption
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
              }`}
            >
              Place your order
            </button>
          </div>

          <div className="w-full bg-white rounded-md shadow-md p-6 h-fit mt-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Delivery Route
            </h2>
            <GoogleMapComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
