import { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";


function getFormattedDate(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const options = { weekday: "long", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default function ActuallyCheckout() {
  const { cart } = useContext(CartContext);
  const [deliveryOption, setDeliveryOption] = useState("tomorrow");


  const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const tax = subtotal * 0.1025;
  const totalWeight = cart.reduce((sum, p) => sum + p.weight * p.qty, 0);
  const deliveryFee = totalWeight < 20 ? 0 : 5;
  const orderTotal = subtotal + tax + deliveryFee;


  const deliverySlots = [
    {
      id: "today",
      label: `Today (${getFormattedDate(0)})`,
      costTag: "Same Day Delivery with FRESHNESS 100🔥🔥🔥🔥",
    },
  ];


  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col lg:flex-row gap-6 p-8">

      {/*Delivery options column TO BE FINISHED: need to make buttons actually do something*/}
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
                <div className="flex items-baseline">
                  <span className="font-medium">{opt.label}</span>
                  <span className="ml-2 text-gray-600">{opt.costTag}</span>
                </div>
                {opt.note && (
                  <p className="text-sm text-gray-500 mt-1">{opt.note}</p>
                )}
              </div>
            </label>
          ))}

          {/*pickup option TO BE FINISHED: need to make buttons actually do something */}
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
        {/*review items column: maybe make smaller?*/}
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
                  <img
                    src={p.url}
                    alt={p.imageAlt}
                    className="w-24 h-24 object-cover border rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.color}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Qty: <strong>{p.qty}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Weight: {(p.weight * p.qty).toFixed(2)} lbs
                    </p>
                    <p className="mt-1 text-md font-medium text-gray-900">
                      ${(p.price * p.qty).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/*Order summary column: xxx*/}
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
              <span>Shipping (weight rule):</span>
              <span>{deliveryFee === 0 ? "Free under 20 lbs" : "$5.00"}</span>
            </li>
            <li className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span>Total weight:</span>
              <span>{totalWeight.toFixed(2)} lbs</span>
            </li>
            <li className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Order total:</span>
              <span>${orderTotal.toFixed(2)}</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => alert("Will do later IM POOPED")}
            className="mt-6 w-full bg-red-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md shadow-md"
          >
            Place your order
          </button>
        </div>
      </div>
    </div>
  );
}
