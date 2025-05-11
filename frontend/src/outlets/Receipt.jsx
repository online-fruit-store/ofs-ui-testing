import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !state.cartItems) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state || !state.cartItems) {
    return null;
  }

  const { cartItems, transactionId, total: orderTotal } = state;
  const orderDate = new Date().toLocaleString();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.1025;
  const taxAmount = subtotal * taxRate;
  const totalWeight = cartItems.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0
  );
  const shippingFee = totalWeight >= 20 ? 5 : 0;
  const total = subtotal + taxAmount + shippingFee;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-15">
      <div className="p-8">
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>
        <p className="mt-4 text-lg">
          Your receipt and confirmation details are below.
        </p>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Order Receipt</h1>
      <div className="mb-4 text-gray-600 text-center">
        <p>
          Transaction ID: <span className="font-semibold">{transactionId}</span>
        </p>
        <p>
          Date: <span className="font-semibold">{orderDate}</span>
        </p>
      </div>
      <hr className="my-6" />
      <div>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Quantity: {item.quantity} | Weight:{" "}
                {(item.weight * item.quantity).toFixed(2)} lbs
              </p>
            </div>
            <div className="text-right">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-6" />
      <div className="text-right text-lg space-y-2">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>
          Shipping: {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
        </p>
        <p>Tax (10.25%): ${taxAmount.toFixed(2)}</p>
        <p>Total Weight: {totalWeight.toFixed(2)} lbs</p>
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
      </div>
      <div className="mt-4 text-center">
        <p>
          Order Status:{" "}
          <span className="font-semibold capitalize">
            {state.orderStatus || "pending"}
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Your order is being processed.
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
